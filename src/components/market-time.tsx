import { cn } from "@/lib/utils";

interface MarketTimeProps {
    endTime: bigint;
    className?: string;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export function MarketTime({ endTime, className }: MarketTimeProps) {
    const isEnded = new Date(Number(endTime) * 1000) < new Date();
    const formattedDate = formatDate(new Date(Number(endTime) * 1000).toISOString());

    return (
        <div
            className={cn(
                "mb-2 w-fit px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors",
                isEnded 
                    ? "bg-destructive/10 border-destructive/20 text-destructive" 
                    : "bg-muted/50 border-border text-muted-foreground",
                className
            )}
            style={{
                fontFamily: 'var(--font-sans)', 
                letterSpacing: 'var(--tracking-normal)',
                boxShadow: 'var(--shadow-xs)'
            }}
        >
            {isEnded ? "Ended: " : "Ends: "}{formattedDate}
        </div>
    );
}
