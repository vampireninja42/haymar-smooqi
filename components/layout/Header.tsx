"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        "bg-white/80 backdrop-blur-md",
        scrolled && "shadow-sm"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span style={{ color: '#111827' }}>Sm</span>
          <span style={{ color: '#7C3AED' }}>ooqi</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-[var(--button-radius)]" asChild>
            <Link href="/signup">Start Learning Free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
