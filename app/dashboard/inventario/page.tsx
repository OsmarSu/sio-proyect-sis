import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StatCard from "../../../components/dashboard/StatCard";
import ProductList from "./components/ProductList";

const PlusIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

const InventoryPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Inventario</h1>
        <p className="text-gray-400 mt-1">
          Gestiona los productos y controla el stock de la juguetería
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Productos"
          value="1,234"
          description="Productos registrados"
        />
        <StatCard
          title="Stock Crítico"
          value="12"
          description="Necesitan reabastecimiento"
          isCritical={true}
        />
        <StatCard
          title="Valor Inventario"
          value="Bs. 125,000"
          description="Valor total del stock"
        />
        <StatCard
          title="Categorías"
          value="24"
          description="Categorías activas"
        />
      </div>

      <div className="bg-neutral-900/50 p-6 rounded-lg border border-neutral-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Lista de Productos
            </h2>
            <p className="text-gray-400">
              Visualiza y gestiona todos los productos del inventario
            </p>
          </div>

          <div className="flex w-full md:w-auto items-center gap-2">
            <Input
              type="search"
              placeholder="Buscar producto..."
              className="w-full md:w-auto flex-shrink min-w-0"
            />

            <Button variant="secondary" className="whitespace-nowrap">
              Filtros
            </Button>

            <Button
              variant="primary"
              icon={PlusIcon}
              className="whitespace-nowrap"
            >
              Nuevo Producto
            </Button>
          </div>
        </div>

        <ProductList />
      </div>
    </div>
  );
};

export default InventoryPage;
