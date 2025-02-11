import { UserProvider } from "@/context/authContext";
import { TripsProvider } from "@/context/tripsContext";
import "./globals.css";
import Header from "@/components/header";
import Head from "next/head";
import Footer from "@/components/footer";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <link rel="icon" href="/images/logo.png" sizes="any" />
      </Head>

      <html lang="en">
        <TripsProvider>
          <UserProvider>
            <body className="flex flex-col">
              <Header />
              {children}
              <Footer />
            </body>
          </UserProvider>
        </TripsProvider>
      </html>
    </>
  );
}
