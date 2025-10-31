import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  category?: 'fitness' | 'travel' | 'creative' | 'gaming' | 'learning' | 'food' | 'default';
  className?: string;
}

export default function Badge({
  children,
  category = 'default',
  className = '',
}: BadgeProps) {
  // BRANDBOOK: Interest Badge colors
  const categoryColors = {
    fitness: 'bg-[#FF006B]',    // Hot Pink
    travel: 'bg-[#00D9FF]',     // Cyan
    creative: 'bg-[#9B51E0]',   // Purple
    gaming: 'bg-[#F59E0B]',     // Amber
    learning: 'bg-[#3B82F6]',   // Blue
    food: 'bg-[#EF4444]',       // Red
    default: 'bg-[#BFFF00]',    // Electric Lime
  };

  return (
    <span
      className={`
        ${categoryColors[category]}
        text-white
        px-4
        py-2
        rounded-full
        text-sm
        font-semibold
        inline-flex
        items-center
        gap-2
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </span>
  );
}
