import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const Button = ({ children, icon, variant = 'primary', className = '' }: ButtonProps) => {
  const baseStyles = "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors";
  
  const variantStyles = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary: "bg-neutral-700 text-white hover:bg-neutral-600 border border-neutral-600",
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {icon}
      <span>{children}</span>
    </button>
  );
};

export default Button;