import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { GetServerSideProps, NextPage } from 'next';

const LogoutPage: NextPage = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabaseClient = createServerSupabaseClient(ctx);

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.log('signOut error', error);
  }

  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
};

export default LogoutPage;
