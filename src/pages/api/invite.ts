import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { RoleIdByName } from '@/constants/constants';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // validate request body
  const schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    propertyId: z.string(),
  });

  if (!schema.safeParse(req.body).success) {
    res.status(400).json({ message: 'Invalid request body' });
    return;
  }

  const supabase = createServerSupabaseClient({ req, res });

  // check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { firstName, lastName, email, propertyId } = req.body;

    // check if use is an owner (authorised to invite guests)
    const { data: ownerData, error: ownerError } = await supabase
      .from('fact_table')
      .select()
      .eq('property_id', propertyId)
      .eq('profile_id', session.user.id)
      .eq('role_id', RoleIdByName.Owner)
      .single();

    if (ownerError) {
      console.log({ ownerError });
      return res.status(500).json({ error: ownerError.message });
    }

    // invite user
    const { data: inviteData, error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: {
          firstName,
          lastName,
        },
      });

    let profileId;

    if (inviteError) {
      // e.g. user already exists
      console.log('inviteError', inviteError.message);

      // get user id from email
      const { data: user, error: userError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      profileId = user?.id;
    } else {
      profileId = inviteData?.user.id;
    }

    if (!profileId) {
      return res.status(500).json({ error: 'Could not find user' });
    }

    // update first and last name in profile table
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
      })
      .eq('id', profileId);

    // check if user is already a guest for this property
    const guest = await supabaseAdmin
      .from('fact_table')
      .select()
      .eq('profile_id', profileId)
      .eq('property_id', propertyId);

    const notAGuest = guest.data?.length === 0;

    if (notAGuest) {
      // add user as guest
      await supabaseAdmin.from('fact_table').insert({
        created_at: new Date(),
        profile_id: profileId,
        property_id: propertyId,
        role_id: RoleIdByName.Guest,
      });
    } else {
      return res.status(409).json({ error: 'User is already a guest' });
    }

    return res.status(200).json({});
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
