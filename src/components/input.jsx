import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", ...props },
  ref
) {
  const id = useId();
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg 
          bg-white text-gray-900 placeholder-gray-500 text-sm sm:text-base
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          focus:outline-none transition-all duration-200
          hover:border-gray-400 shadow-sm hover:shadow-md
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}
        `}
        ref={ref}
        {...props}
        id={id}
      />
    </div>
  );
});

export default Input;
