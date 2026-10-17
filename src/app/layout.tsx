import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agents Map // 3D Exploration & Simulation',
  description: 'Interactive 3D 5-story building exploration game and aerial drone simulation powered by Three.js and Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="overflow-hidden bg-[#0a0c10] text-slate-100 antialiased select-none">
        {children}
      </body>
    </html>
  );
}
