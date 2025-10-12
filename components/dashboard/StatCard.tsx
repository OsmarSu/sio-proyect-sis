import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  isCritical?: boolean; 
}

const StatCard = ({ title, value, description, isCritical = false }: StatCardProps) => {
  const valueColor = isCritical ? 'text-red-500' : 'text-white';

  return (
    <article className="bg-neutral-900/50 text-white p-4 rounded-xl border border-neutral-800 flex flex-col justify-between shadow-md">
      <div>
        <h3 className="text-sm font-medium text-neutral-400">{title}</h3>
      </div>
      <div>
        <p className={`text-3xl font-bold mt-2 ${valueColor}`}>{value}</p>
        <p className="text-neutral-400 text-sm">{description}</p>
      </div>
    </article>
  );
};

export default StatCard;