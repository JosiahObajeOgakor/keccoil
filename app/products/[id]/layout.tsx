export function generateStaticParams() {
  return [1, 2, 3, 4, 5, 6, 7, 8].map((id) => ({
    id: String(id),
  }));
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
