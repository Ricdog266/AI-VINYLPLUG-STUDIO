export const metadata = {
  title: "AI VinylPlug Studio",
  description: "Persona Extractor Engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
