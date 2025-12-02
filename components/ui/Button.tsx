import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'default';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const Button = ({ children, icon, variant = 'primary', size = 'default', className = '', ...props }: ButtonProps) => {
  const baseStyles = "flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantStyles = {
    primary: "bg-white text-black hover:bg-gray-200",
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-neutral-700 text-white hover:bg-neutral-600 border border-neutral-600",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  // Fallback for legacy 'primary' variant if it was intended as default
  const selectedVariant = variantStyles[variant] || variantStyles.primary;
  const selectedSize = sizeStyles[size] || sizeStyles.default;

  return (
    <button 
      className={`${baseStyles} ${selectedVariant} ${selectedSize} ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

export default Button;