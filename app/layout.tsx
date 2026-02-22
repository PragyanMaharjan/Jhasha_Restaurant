import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StoreProvider } from '@/lib/storeProvider';

export const metadata: Metadata = {
  title: 'Jhasha Restaurant',
  description: 'Order delicious food online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-light">
        <StoreProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}
