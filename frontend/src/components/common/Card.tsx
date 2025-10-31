import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'neon';
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  variant = 'default',
  className = '',
  onClick,
}: CardProps) {
  if (variant === 'neon') {
    // BRANDBOOK: Neon Border Card with glow effect
    return (
      <div className="relative">
        {/* Neon glow */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#BFFF00] to-[#00D9FF] rounded-3xl blur-lg opacity-50 -z-10"
          aria-hidden="true"
        />

        {/* Card */}
        <div
          className={`
            relative
            bg-[#161B22]
            rounded-3xl
            p-6
            border-2
            border-transparent
            ${onClick ? 'cursor-pointer hover:border-[#BFFF00]/20 transition-colors' : ''}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          onClick={onClick}
        >
          {children}
        </div>
      </div>
    );
  }

  // BRANDBOOK: Regular Card
  return (
    <div
      className={`
        bg-[#161B22]
        border border-[rgba(255,255,255,0.1)]
        rounded-[20px]
        p-5
        shadow-[0_4px_12px_rgba(0,0,0,0.15)]
        ${onClick ? 'cursor-pointer hover:border-[rgba(255,255,255,0.2)] transition-colors' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
