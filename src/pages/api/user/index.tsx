import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  if (req.method === 'DELETE') {
    // 1. check if user is owner or guest of any properties
    const { data: userData, error: userError } = await supabase
      .from('fact_table')
      .select()
      .eq('profile_id', session.user.id);

    // 2. get the property ids of which they are the owner
    const ownedPropertyIds =
      userData &&
      userData
        .filter((item) => item.role_id === 'OWNER')
        .map((item) => item.property_id);

    // 3. delete all guests/owners for any property that they own
    if (ownedPropertyIds) {
      for (const propertyId of ownedPropertyIds) {
        const { error } = await supabase
          .from('fact_table')
          .delete()
          .eq('property_id', propertyId);
      }
    }

    // 4. delete themselves from properties for which they are a guest
    const { error } = await supabase
      .from('fact_table')
      .delete()
      .eq('profile_id', session.user.id);

    // 5. delete properties for which they are the owner
    if (ownedPropertyIds) {
      for (const propertyId of ownedPropertyIds) {
        console.log('delete property with id: ', propertyId);
        const { error } = await supabase
          .from('properties')
          .delete()
          .eq('id', propertyId);
      }
    }

    // 6. delete user from profiles
    const { error: deleteProfilesError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', session.user.id);

    console.log({ deleteProfilesError });

    // 8. delete user from users table
    const { error: signOutError } = await supabase.auth.signOut();

    console.log({ signOutError });

    // 9. delete user from users table
    const { error: userDeleteError } =
      await supabaseAdmin.auth.admin.deleteUser(session.user.id);

    console.log({ userDeleteError });

    res.status(200).json({ message: 'User deleted' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
