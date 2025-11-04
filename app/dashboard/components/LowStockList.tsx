import Badge from "@/components/ui/Badge";
import AlertCircleIcon from "@/components/icons/AlertCircleIcon";

const lowStockProducts = [
  { name: "Carro de Control Remoto", stock: 3, min: 10 },
  { name: "Muñeca Barbie", stock: 5, min: 15 },
  { name: "Lego City", stock: 2, min: 8 },
];

const LowStockList = () => {
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
        {lowStockProducts.map((product) => (
          <div
            key={product.name}
            className="flex justify-between items-center border border-orange-200 bg-orange-50/30 p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <div>
              <p className="font-semibold text-gray-900">{product.name}</p>
              <p className="text-sm text-gray-600 mt-1">
                Stock actual: <span className="font-medium text-orange-600">{product.stock}</span> (Mínimo: {product.min})
              </p>
            </div>
            <Badge variant="danger">Urgente</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockList;