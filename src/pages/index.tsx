import { ReactElement } from 'react';

import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Headline from '@/components/ui/Headline';

import { NextPageWithLayout } from './_app';

const HomePage: NextPageWithLayout = () => {
  return (
    <Container>
      <Headline level={1}>
        Effortlessly manage your vacation home with Bookie
      </Headline>
      <p className="mt-6">
        Bookie is a user-friendly platform designed to assist families and
        friends in managing their jointly owned vacation homes. With Bookie, you
        no longer have to worry about manually coordinating who can stay at the
        property and when. Your family and friends can easily make their own
        reservations based on your predetermined configuration, simplifying the
        entire booking process.
      </p>
      <p></p>
      <div className="mt-12">
        <Headline level={2}>Benefits</Headline>
        <div className="mt-6 flex flex-col gap-6 md:flex-row">
          <div>
            <Headline level={5}>Easy scheduling</Headline>
            <p>
              Bookie makes it easy for family and friends to schedule stays at
              the vacation home without a central coordinator.
            </p>
          </div>

          <div>
            <Headline level={5}>Organized reservations</Headline>
            <p>
              Keep track of who has booked the property and when to prevent
              double bookings and ensure everyone has a fair opportunity to use
              it.
            </p>
          </div>

          <div>
            <Headline level={5}>Reduced stress</Headline>
            <p>
              Simplifying the booking process and eliminating the need for a
              central coordinator can help reduce stress and potential
              conflicts.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout title="Bookie">{page}</Layout>;
};

export default HomePage;
