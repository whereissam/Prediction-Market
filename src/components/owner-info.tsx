import { useIsOwner } from "@/hooks/useIsOwner";
import { Crown } from "lucide-react";

export function OwnerInfo() {
    const { isOwner, isLoading } = useIsOwner();

    if (isLoading || !isOwner) {
        return null;
    }

    return (
        <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold border border-primary/20" style={{fontFamily: 'var(--font-sans)', letterSpacing: 'var(--tracking-normal)', boxShadow: 'var(--shadow-xs)'}}>
            <Crown className="w-3 h-3" />
            <span className="hidden xs:inline">Contract Owner</span>
            <span className="xs:hidden">Owner</span>
        </div>
    );
}