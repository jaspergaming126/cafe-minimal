import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', message }) => {
    const sizeClasses = {
        sm: 'h-6 w-6 border-2',
        md: 'h-12 w-12 border-4',
        lg: 'h-16 w-16 border-4',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div
                className={`animate-spin rounded-full border-primary border-t-transparent ${sizeClasses[size]}`}
            />
            {message && (
                <p className="text-stone-light dark:text-stone-400 text-sm font-medium animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;
