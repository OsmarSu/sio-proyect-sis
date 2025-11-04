import PackageIcon from "@/components/icons/PackageIcon";
import ShoppingCartIcon from "@/components/icons/ShoppingCartIcon";
import UsersIcon from "@/components/icons/UsersIcon";
import TruckIcon from "@/components/icons/TruckIcon";
import Link from "next/link";

const QuickAccessCard = ({
  title,
  icon,
  href,
  color,
}: {
  title: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}) => {
  const colorClasses: { [key: string]: { bg: string; hover: string; icon: string } } = {
    blue: {
      bg: 'bg-blue-50',
      hover: 'hover:bg-blue-100',
      icon: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      hover: 'hover:bg-green-100',
      icon: 'text-green-600'
    },
    purple: {
      bg: 'bg-purple-50',
      hover: 'hover:bg-purple-100',
      icon: 'text-purple-600'
    },
    orange: {
      bg: 'bg-orange-50',
      hover: 'hover:bg-orange-100',
      icon: 'text-orange-600'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <Link
      href={href}
      className={`${colors.bg} ${colors.hover} border border-gray-200 p-6 rounded-xl flex flex-col items-center justify-center text-center gap-3 transition-all hover:shadow-md group`}
    >
      <span className={`${colors.icon} transform group-hover:scale-110 transition-transform`}>
        {icon}
      </span>
      <p className="font-semibold text-gray-900">{title}</p>
    </Link>
  );
};

const QuickAccessGrid = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Accesos Rápidos</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Módulos principales del sistema
      </p>
      <div className="grid grid-cols-2 gap-4">
        <QuickAccessCard
          title="Inventario"
          icon={<PackageIcon className="h-8 w-8" />}
          href="/dashboard/inventario"
          color="blue"
        />
        <QuickAccessCard
          title="Ventas"
          icon={<ShoppingCartIcon className="h-8 w-8" />}
          href="/dashboard/ventas"
          color="green"
        />
        <QuickAccessCard
          title="Clientes"
          icon={<UsersIcon className="h-8 w-8" />}
          href="/dashboard/clientes"
          color="purple"
        />
        <QuickAccessCard
          title="Proveedores"
          icon={<TruckIcon className="h-8 w-8" />}
          href="/dashboard/proveedores"
          color="orange"
        />
      </div>
    </div>
  );
};

export default QuickAccessGrid;