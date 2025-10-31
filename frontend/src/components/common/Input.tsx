import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
            {label}
          </label>
        )}

        {/* Input field - BRANDBOOK styles */}
        <input
          ref={ref}
          className={`
            bg-[#161B22]
            border-2
            border-[rgba(255,255,255,0.1)]
            rounded-xl
            px-4
            py-3.5
            text-base
            text-[#FFFFFF]
            placeholder:text-[#6E6E8F]
            w-full
            transition-all
            duration-200
            focus:outline-none
            focus:border-[#BFFF00]
            focus:shadow-[0_0_0_4px_rgba(191,255,0,0.1)]
            disabled:opacity-50
            disabled:cursor-not-allowed
            ${error ? 'border-[#FF3B30] focus:border-[#FF3B30] focus:shadow-[0_0_0_4px_rgba(255,59,48,0.1)]' : ''}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          {...props}
        />

        {/* Error message */}
        {error && (
          <p className="mt-2 text-sm text-[#FF3B30]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
