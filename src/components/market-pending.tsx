export function MarketPending() {
    return (
        <div className="flex flex-col gap-2">
            <div className="mb-2 bg-secondary/50 text-secondary-foreground p-3 rounded-lg text-center text-sm font-medium border border-secondary/30" style={{fontFamily: 'var(--font-sans)', letterSpacing: 'var(--tracking-normal)', boxShadow: 'var(--shadow-xs)'}}>
                Pending resolution
            </div>
        </div>
    );
}
