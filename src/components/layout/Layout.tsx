import Head from 'next/head';
import Link from 'next/link';

import Container from '../ui/Container';

type LayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

const Layout = ({ title = '', description = '', children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{`${title} | Bookie`}</title>
        <meta name="description" content={description} />
      </Head>
      <Container>
        <header className="pt-6 pb-6">
          <nav>
            <div className="flex items-center justify-between">
              <div>
                <Link href="/">
                  <strong>Bookie</strong>
                </Link>
              </div>
              <div className="flex gap-4">
                <div>
                  <Link href="/login">Login</Link>
                </div>
                <div>
                  <Link href="/signup">Sign up</Link>
                </div>
              </div>
            </div>
          </nav>
        </header>
      </Container>
      <main>{children}</main>
    </>
  );
};

export default Layout;
