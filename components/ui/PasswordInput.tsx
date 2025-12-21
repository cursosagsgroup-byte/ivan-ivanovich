'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    containerClassName?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, containerClassName, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        return (
            <div className={`relative ${containerClassName || ''}`}>
                <input
                    type={showPassword ? 'text' : 'password'}
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#B70126] sm:text-sm sm:leading-6 px-3 pr-10 ${className || ''}`}
                    ref={ref}
                    {...props}
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 focus:outline-none"
                    tabIndex={-1} // Prevent tabbing to the eye icon
                >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                        {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                </button>
            </div>
        );
    }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
