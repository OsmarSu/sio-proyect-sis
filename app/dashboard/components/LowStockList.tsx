import Badge from "@/components/ui/Badge";
import AlertCircleIcon from "@/components/icons/AlertCircleIcon";

type LowStockProduct = {
  id: number;
  name: string;
  stock: number;
  min: number;
};

interface LowStockListProps {
  products: LowStockProduct[];
}

const LowStockList = ({ products }: LowStockListProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
          <AlertCircleIcon className="text-yellow-600 h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Productos con Stock Bajo</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Productos que necesitan reabastecimiento urgente
      </p>
      <div className="space-y-3">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center border border-orange-200 bg-orange-50/30 p-4 rounded-lg hover:shadow-md transition-shadow"
            >
              <div>
                <p className="font-semibold text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Stock actual: <span className="font-medium text-orange-600">{product.stock}</span>
                </p>
              </div>
              <Badge variant="danger">Urgente</Badge>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No hay productos con stock bajo.</p>
        )}
      </div>
    </div>
  );
};

export default LowStockList;