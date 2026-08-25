import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  // =====================================================
  // VARIANTS (ពណ៌ផ្សេងៗគ្នា)
  // =====================================================
  const variants = {
    primary: `bg-[#EF233C] text-white hover:bg-[#D91A2A] shadow-md shadow-[#EF233C]/25`,
    secondary: `bg-[#143DAA] text-white hover:bg-[#0F2D7A] shadow-md shadow-[#143DAA]/25`,
    outline: `border-2 border-[#143DAA] text-[#143DAA] hover:bg-[#143DAA] hover:text-white`,
    danger: `bg-red-600 text-white hover:bg-red-700`,
    success: `bg-green-600 text-white hover:bg-green-700`,
  };

  // =====================================================
  // SIZES (ទំហំផ្សេងៗគ្នា)
  // =====================================================
  const sizes = {
    sm: 'px-4 py-2 text-[12px]',
    md: 'px-6 py-3 text-[14px]',
    lg: 'px-8 py-4 text-[16px]',
    // ទំហំពិសេសសម្រាប់ Navbar
    navbar: 'h-[50px] min-w-[140px] xl:min-w-[145px] pl-5 pr-[5px] text-[12px] xl:text-[13px]',
  };

  // =====================================================
  // DISABLED STATE (ពេលចុចមិនបាន)
  // =====================================================
  const disabledStyles = disabled 
    ? 'opacity-50 cursor-not-allowed hover:scale-100' 
    : '';

  return (
    <button
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        font-bold
        transition-all
        duration-300
        transform
        hover:scale-105
        active:scale-95
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-[#EF233C]
        ${variants[variant]}
        ${sizes[size]}
        ${disabledStyles}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;