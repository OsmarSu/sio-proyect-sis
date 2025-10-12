
const Input = ({ 
  type = "text", 
  placeholder = "Buscar productos por nombre, código o categoría...", 
  className = "",
  showIcon = true,
  ...props 
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      {showIcon && (
        <div className="absolute left-[0.75em] top-1/2 -translate-y-1/2 text-gray-400">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-[1.25em] h-[1.25em]" 
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" 
            />
          </svg>
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`
          w-full bg-neutral-900/50 border border-gray-800 rounded-lg 
          ${showIcon ? 'pl-[2.5em]' : 'pl-[0.75em]'} pr-[0.75em] py-[0.5em]
          text-white placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-offset-black 
          transition-all duration-200
          text-base leading-relaxed
          min-h-[2.5em]
          resize-none
        `}
        {...props}
      />
    </div>
  );
};

export default Input;