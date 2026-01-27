import { Loader2 } from "lucide-react";

interface LoadingSkeletonProps {
    type?: "table" | "card" | "form" | "stats";
    count?: number;
}

export function LoadingSkeleton({ type = "card", count = 3 }: LoadingSkeletonProps) {
    if (type === "table") {
        return (
            <div className="space-y-3">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                ))}
            </div>
        );
    }

    if (type === "card") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                ))}
            </div>
        );
    }

    if (type === "form") {
        return (
            <div className="space-y-4">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i}>
                        <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
                        <div className="h-10 bg-muted animate-pulse rounded" />
                    </div>
                ))}
            </div>
        );
    }

    if (type === "stats") {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
}
