import './globals.css';

export const metadata = {
  title: 'Shopping Codex',
  description: 'Converted Streamlit application to Next.js',
};

import dynamic from 'next/dynamic';
const Providers = dynamic(() => import('./providers.client'), { ssr: false });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
