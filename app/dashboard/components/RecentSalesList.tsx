import Badge from "@/components/ui/Badge";

type RecentSale = {
  id: number;
  customer: string;
  date: string;
  total: number;
};

interface RecentSalesListProps {
  sales: RecentSale[];
}

const RecentSalesList = ({ sales }: RecentSalesListProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Ventas Recientes</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">Últimas ventas realizadas</p>
      <div className="space-y-3">
        {sales.length > 0 ? (
          sales.map((sale) => (
            <div
              key={sale.id}
              className="flex justify-between items-center border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow"
            >
              <div>
                <p className="font-semibold text-gray-900">Venta #{sale.id}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {sale.customer} • {new Date(sale.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 mb-1">Bs. {sale.total.toFixed(2)}</p>
                <Badge variant="success">Completada</Badge>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No hay ventas recientes.</p>
        )}
      </div>
    </div>
  );
};

export default RecentSalesList;