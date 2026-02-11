
'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error
        console.error('🚨 Page Error caught in app/error.tsx:', error);
        console.error('Digest:', error.digest);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
            <h2 className="text-xl font-bold mb-4">Something went wrong on this page!</h2>
            <p className="mb-4 text-red-500">{error.message}</p>
            <button
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={() => reset()}
            >
                Try again
            </button>
        </div>
    );
}
