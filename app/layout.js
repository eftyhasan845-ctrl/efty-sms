import "./globals.css";

export const metadata = {
  title: "Efty SMS",
  description: "SMS Sender"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
