import { getPosData } from '@/actions/sales-actions';
// ⚠️ CORRECCIÓN: Importamos VentasClient, NO ReceiptModal
import VentasClient from '../ventas/components/sales/ventas-client'; 

export const dynamic = 'force-dynamic';

export default async function VentasPage() {
  const { products, clients } = await getPosData();

  return (
    <div className="h-full w-full">
      <VentasClient 
        initialProducts={products} 
        initialClients={clients} 
      />
    </div>
  );
}