import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps } from 'next';
import { ReactElement, useContext } from 'react';

import { DialogContext } from '@/components/dialog/DialogContext';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';
import SectionHeading from '@/components/layout/SectionHeading';
import PropertyContent from '@/components/property/PropertyContent';
import PropertyForm from '@/components/property/PropertyForm';
import PropertyList from '@/components/property/PropertyList';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import FloatingActionButton from '@/components/ui/FloatingActionButton';

import { NextPageWithLayout } from '../_app';

const PropertiesPage: NextPageWithLayout = () => {
  const dialogContext = useContext(DialogContext);

  function handleShowPropertyForm() {
    dialogContext?.setDialog(
      <PropertyForm
        onSuccess={() => {
          dialogContext.setOpen(false);
        }}
      />
    );

    dialogContext?.setOpen(true);
  }

  return (
    <Container>
      <PropertyContent>
        <SectionHeading
          title="Properties"
          action={
            <Button
              onClick={handleShowPropertyForm}
              className="hidden sm:inline-flex"
            >
              Add property
            </Button>
          }
        />
        <PropertyList />
        <div className="sm:hidden">
          <FloatingActionButton onClick={handleShowPropertyForm} />
        </div>
      </PropertyContent>
    </Container>
  );
};

PropertiesPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthenticatedLayout title="Properties">{page}</AuthenticatedLayout>;
};

export default PropertiesPage;

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
    },
  };
};
