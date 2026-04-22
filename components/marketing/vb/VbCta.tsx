"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function VbCta() {
  return (
    <section className="w-full" style={{ background: "#1A6B4A" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6"
      >
        <h2
          className="font-bold"
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(32px, 5vw, 40px)",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          Your reading habit starts today.
        </h2>
        <p
          className="mx-auto mt-5 max-w-xl text-lg"
          style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}
        >
          Join thousands of curious minds. One lesson a day. 7-day free trial.
        </p>

        <div className="mt-10">
          <Link
            href="/signup"
            className="inline-block rounded-[8px] px-10 py-4 text-base font-semibold transition-opacity hover:opacity-90"
            style={{ background: "#FFFFFF", color: "#1A6B4A" }}
          >
            Start Free Trial
          </Link>
        </div>

        <p className="mt-5 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
          No credit card. No pressure. Just knowledge.
        </p>
      </motion.div>
    </section>
  );
}
