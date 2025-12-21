import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    searchQuery?: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl, searchQuery }: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Logic to show a window of pages if there are too many
    // For simplicity, we'll show all pages if <= 7, otherwise show start, end, and current window
    // But per user request "numeros y flechas", let's try to keep it simple first.

    // Helper to generate URL
    const getUrl = (page: number) => {
        // We assume baseUrl is just the path, e.g. /blog
        // But we need to append existing query params if any
        // Since this is a server component usage mostly, we might need to pass current params
        // OR we can just use a simple string replacement if we pass the full searchParams object
        // BUT for simplicity in this specific use case, let's accept an optional search param prop
        return `${baseUrl}?page=${page}${searchQuery ? `&search=${searchQuery}` : ''}`;
    };

    return (
        <div className="flex items-center justify-center space-x-2 mt-12">
            {/* Previous Button */}
            {currentPage > 1 ? (
                <Link
                    href={getUrl(currentPage - 1)}
                    className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
            ) : (
                <span className="p-2 rounded-md border border-gray-200 text-gray-300 cursor-not-allowed">
                    <ChevronLeft className="h-5 w-5" />
                </span>
            )}

            {/* Page Numbers */}
            {pages.map((page) => {
                // Simple logic: show first, last, and pages around current
                if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                    return (
                        <Link
                            key={page}
                            href={getUrl(page)}
                            className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${currentPage === page
                                ? 'bg-[#B70126] border-[#B70126] text-white'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {page}
                        </Link>
                    );
                } else if (
                    (page === currentPage - 2 && currentPage > 3) ||
                    (page === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                    return <span key={page} className="text-gray-400">...</span>;
                }
                return null;
            })}

            {/* Next Button */}
            {currentPage < totalPages ? (
                <Link
                    href={getUrl(currentPage + 1)}
                    className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                    <ChevronRight className="h-5 w-5" />
                </Link>
            ) : (
                <span className="p-2 rounded-md border border-gray-200 text-gray-300 cursor-not-allowed">
                    <ChevronRight className="h-5 w-5" />
                </span>
            )}
        </div>
    );
}
