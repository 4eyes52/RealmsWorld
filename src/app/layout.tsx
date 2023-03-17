import {Provider} from "./providers/provider";
import "./globals.css";

export const metadata = {
  title: "Bibliotheca DAO",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* <Provider>{children}</Provider> */}
        {children}
      </body>
    </html>
  );
}
