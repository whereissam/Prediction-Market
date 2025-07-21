import { useIsOwner } from "@/hooks/useIsOwner";
import { Crown } from "lucide-react";

export function OwnerInfo() {
    const { isOwner, isLoading } = useIsOwner();

    if (isLoading || !isOwner) {
        return null;
    }

    return (
        <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-500/20 text-orange-800 dark:text-orange-400 px-2 py-1 rounded-md text-xs font-medium border border-orange-200 dark:border-orange-500/50">
            <Crown className="w-3 h-3" />
            <span className="hidden xs:inline">Contract Owner</span>
            <span className="xs:hidden">Owner</span>
        </div>
    );
}