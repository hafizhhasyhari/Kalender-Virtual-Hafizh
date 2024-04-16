import {
  Session,
  User,
  createServerSupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';

import AccountForm from '@/components/account/AccountForm';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';
import Card from '@/components/layout/Card';
import CardContent from '@/components/layout/CardContent';
import SectionHeading from '@/components/layout/SectionHeading';
import PropertyContent from '@/components/property/PropertyContent';
import Container from '@/components/ui/Container';

import { NextPageWithLayout } from './_app';

interface Props {
  user: User;
  initialSession: Session;
}

const AccountPage: NextPageWithLayout<Props> = ({ user, initialSession }) => {
  return (
    <Container>
      <SectionHeading title="Account" />
      <PropertyContent>
        <Card>
          <CardContent>
            <AccountForm session={initialSession} />
          </CardContent>
        </Card>
      </PropertyContent>
    </Container>
  );
};

AccountPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthenticatedLayout title="Account">{page}</AuthenticatedLayout>;
};

export default AccountPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};
