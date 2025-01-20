// src/app/layout.tsx
import "../styles/globals.css"; // Import global styles

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-none">
      <body className="min-h-screxx overflow-x-none flex flex-col">{children}</body>
    </html>
  );
}
