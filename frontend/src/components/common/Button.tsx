import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Base styles (BRANDBOOK: pill-shaped, Inter font)
  const baseStyles = 'rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  // Size variants (BRANDBOOK: spacing кратно 4px)
  const sizeStyles = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
  };

  // Variant styles (BRANDBOOK colors)
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-[#BFFF00] to-[#A3E000]
      text-[#0D1117]
      shadow-[0_0_20px_rgba(191,255,0,0.4)]
      hover:shadow-[0_0_30px_rgba(191,255,0,0.5)]
      hover:scale-[1.02]
      active:scale-[0.98]
      disabled:hover:scale-100
      disabled:hover:shadow-[0_0_20px_rgba(191,255,0,0.4)]
    `,
    secondary: `
      bg-transparent
      border-2 border-[#BFFF00]
      text-[#BFFF00]
      hover:bg-[rgba(191,255,0,0.1)]
      active:bg-[rgba(191,255,0,0.15)]
    `,
    ghost: `
      bg-transparent
      text-[#B4B4C8]
      hover:text-[#FFFFFF]
      hover:bg-[rgba(255,255,255,0.05)]
      active:bg-[rgba(255,255,255,0.1)]
    `,
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${widthStyle}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
