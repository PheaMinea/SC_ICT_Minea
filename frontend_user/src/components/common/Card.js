import React, { forwardRef } from 'react';

const Card = forwardRef(({ 
  children, 
  className = '', 
  variant = 'default', 
  hoverable = true,
  ...props 
}, ref) => {
  
  // =====================================================
  // VARIANTS (ស្ទីលផ្សេងៗគ្នា)
  // =====================================================
  const variants = {
    default: `
      bg-white 
      border 
      border-[#143DAA]/10 
      shadow-md 
      shadow-[#143DAA]/5
    `,
    primary: `
      bg-[#143DAA] 
      text-white 
      border 
      border-[#143DAA] 
      shadow-lg 
      shadow-[#143DAA]/20
    `,
    outline: `
      bg-transparent 
      border-2 
      border-[#143DAA] 
      text-[#143DAA]
    `,
    ghost: `
      bg-transparent 
      border-none 
      shadow-none
    `,
    glass: `
      bg-white/80 
      backdrop-blur-sm 
      border 
      border-white/20 
      shadow-xl
    `,
  };

  // =====================================================
  // HOVER EFFECTS (ពេលដាក់ម៉ៅស៍)
  // =====================================================
  const hoverEffects = hoverable 
    ? `
      hover:-translate-y-1 
      hover:shadow-xl 
      hover:shadow-[#143DAA]/15 
      hover:border-[#EF233C]/20
      transition-all 
      duration-300
    ` 
    : '';

  return (
    <div
      ref={ref}
      className={`
        relative
        overflow-hidden
        rounded-xl
        p-5
        ${variants[variant]}
        ${hoverEffects}
        ${className}
      `}
      {...props}
    >
      {/* =================================================
          DECORATIVE TOP LINE (ស៊ីគ្នាជាមួយ Homepage)
      ================================================= */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#EF233C] to-[#143DAA] opacity-80" />
      
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;