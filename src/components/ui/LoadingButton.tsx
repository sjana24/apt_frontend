import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./button";

interface LoadingButtonProps extends ButtonProps {
    loading?: boolean;
    loadingText?: string;
}

export function LoadingButton({
    loading,
    loadingText,
    children,
    disabled,
    ...props
}: LoadingButtonProps) {
    return (
        <Button disabled={loading || disabled} {...props}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading && loadingText ? loadingText : children}
        </Button>
    );
}
