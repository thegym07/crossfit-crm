import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "La Salle CrossFit — CRM Prospects",
  description: "CRM interne La Salle CrossFit (Saint-Sernin)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full antialiased" style={{ backgroundColor: '#0d0d0d', color: 'white' }}>
        {children}
      </body>
    </html>
  );
}
