import { Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background mt-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-3 py-6 sm:py-8 md:h-24 md:flex-row md:justify-between md:gap-4">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <p className="text-center text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Built with ❤️ by{" "}
              <Link
                href="https://twitter.com/bungeegumeee"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Sam
              </Link>
            </p>
            <div className="hidden sm:block w-px h-4 bg-border"></div>
            <p className="text-center text-xs text-muted-foreground">
              Powered by Ethereum & RainbowKit
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
