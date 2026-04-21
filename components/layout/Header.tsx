"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { themeConfig } from "@/lib/theme";

export function Header({ isLoggedIn }: { isLoggedIn?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isVB = themeConfig.isVB;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isVB ? "bg-white border-b" : "bg-white/80 backdrop-blur-md",
        scrolled && "shadow-sm"
      )}
      style={isVB ? { borderColor: "#E8E4DC" } : undefined}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span style={{ color: '#111827' }}>Sm</span>
          <span style={{ color: isVB ? '#1A6B4A' : '#7C3AED' }}>ooqi</span>
        </Link>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Button
              size="sm"
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-[var(--button-radius)]"
              asChild
            >
              <Link href="/home">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                style={isVB ? { color: "#57534E" } : undefined}
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                size="sm"
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-[var(--button-radius)]"
                asChild
              >
                <Link href="/signup">{isVB ? "Start Reading" : "Start Learning Free"}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
