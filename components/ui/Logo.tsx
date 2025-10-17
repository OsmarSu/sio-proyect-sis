interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo = ({ size = 'md', className = '' }: LogoProps) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizes[size]} bg-indigo-600 rounded-full flex items-center justify-center`}>
        <span className="text-white font-bold text-sm">OASIS</span>
      </div>
      <span className={`font-bold text-gray-800 ${
        size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'
      }`}>
        Oasis Store
      </span>
    </div>
  );
};