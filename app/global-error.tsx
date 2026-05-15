
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
        // Log the error to an error reporting service
        console.error('🚨 Application Error caught in global-error.tsx:', error);
        console.error('Digest:', error.digest);
        console.error('Stack:', error.stack);
    }, [error]);

    return (
        <html translate="no" className="notranslate">
            <head>
                <meta name="google" content="notranslate" />
            </head>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h2 className="text-2xl font-bold mb-4">¡Algo ha salido mal!</h2>
                    <p className="mb-4 text-red-500">{error.message}</p>
                    <p className="text-sm text-gray-500 mb-8">Código: {error.digest}</p>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={
                            // Attempt to recover by trying to re-render the segment
                            () => reset()
                        }
                    >
                        Inténtalo de nuevo
                    </button>
                </div>
            </body>
        </html>
    );
}
