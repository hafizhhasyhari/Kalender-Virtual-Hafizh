import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="h-full bg-gray-100">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-status-bar-style" content="white" />
        <meta name="apple-mobile-web-app-title" content="Bookie" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Bookie" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#1f2937" />
        <link
          rel="preload"
          href="/fonts/Inter-roman.var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <body className="h-full ">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
