import type { Metadata } from "next";
import { DM_Mono, DM_Serif_Display, Epilogue } from "next/font/google";
import "./globals.css";

const serif = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"]
});

const sans = Epilogue({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"]
});

const mono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"]
});

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
      <body className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}
