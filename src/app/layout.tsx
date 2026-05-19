import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Martín Alvarez Martinez | Data Scientist & Data Engineer",
  description: "Interactive portfolio of Martín Alvarez Martinez, focused on data engineering, analytics automation, applied AI and business intelligence.",
  keywords: [
    "data scientist",
    "data engineer",
    "Next.js",
    "Python",
    "PySpark",
    "Power BI",
    "Groq",
    "analytics",
    "portfolio"
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
