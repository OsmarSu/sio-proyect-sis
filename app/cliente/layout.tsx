import { ClientLayout } from '@/components/layout/ClientLayout';

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}