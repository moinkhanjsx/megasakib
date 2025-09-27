import React from 'react'

function Button({
    children,
    type = 'button',
    bgColor = 'bg-blue-600',
    textColor = 'text-white',
    className = '',
    ...props    
}) {
  return (
    <button 
      type={type}
      className={`
        px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 
        transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        text-sm sm:text-base
        ${bgColor} ${textColor} ${className}
      `} 
      {...props}
    >
        {children}
    </button>
  )
}   

export default Button
