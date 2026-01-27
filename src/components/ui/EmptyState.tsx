import { AlertCircle, FileQuestion, Search } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
    icon?: "search" | "file" | "alert";
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({
    icon = "file",
    title,
    description,
    action
}: EmptyStateProps) {
    const Icon = icon === "search" ? Search : icon === "alert" ? AlertCircle : FileQuestion;

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
                <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground max-w-md mb-4">
                    {description}
                </p>
            )}
            {action && (
                <Button onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    );
}
