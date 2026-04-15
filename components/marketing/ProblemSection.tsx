"use client";

import { motion } from "framer-motion";

export function ProblemSection() {
  return (
    <section className="bg-muted/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              You Want to Learn Everything.
              <br />
              So You Learn Nothing.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              You save articles you never read. You bookmark courses you never
              finish. You start learning something new every week — then
              forget about it by Friday.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              It&apos;s not a motivation problem. It&apos;s a system problem.
              You need a way to learn that actually fits your life.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <svg viewBox="0 0 360 300" fill="none" className="h-auto w-full max-w-[360px]" xmlns="http://www.w3.org/2000/svg">
              {/* Card 1 — background, rotated left */}
              <rect x="20" y="30" width="200" height="130" rx="12" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1.5" transform="rotate(-8 20 30)" />
              <rect x="38" y="48" width="80" height="8" rx="4" fill="#E5E7EB" transform="rotate(-8 38 48)" />
              <rect x="38" y="62" width="140" height="6" rx="3" fill="#F3F4F6" transform="rotate(-8 38 62)" />
              <rect x="38" y="74" width="120" height="6" rx="3" fill="#F3F4F6" transform="rotate(-8 38 74)" />
              <rect x="38" y="86" width="100" height="6" rx="3" fill="#F3F4F6" transform="rotate(-8 38 86)" />
              {/* Card 2 — middle, slight tilt right */}
              <rect x="80" y="50" width="210" height="135" rx="12" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1.5" transform="rotate(4 80 50)" />
              <rect x="96" y="66" width="90" height="8" rx="4" fill="#E5E7EB" transform="rotate(4 96 66)" />
              <rect x="96" y="80" width="155" height="6" rx="3" fill="#F3F4F6" transform="rotate(4 96 80)" />
              <rect x="96" y="92" width="130" height="6" rx="3" fill="#F3F4F6" transform="rotate(4 96 92)" />
              <rect x="96" y="104" width="110" height="6" rx="3" fill="#F3F4F6" transform="rotate(4 96 104)" />
              {/* Card 3 — front, straight */}
              <rect x="55" y="100" width="215" height="138" rx="12" fill="white" stroke="#D1D5DB" strokeWidth="1.5" />
              <rect x="72" y="116" width="95" height="9" rx="4" fill="#E5E7EB" />
              <rect x="72" y="132" width="160" height="6" rx="3" fill="#F3F4F6" />
              <rect x="72" y="144" width="140" height="6" rx="3" fill="#F3F4F6" />
              <rect x="72" y="156" width="120" height="6" rx="3" fill="#F3F4F6" />
              <rect x="72" y="168" width="100" height="6" rx="3" fill="#F3F4F6" />
              {/* Red X badges */}
              <circle cx="252" cy="78" r="14" fill="#FEE2E2" />
              <text x="246" y="84" fontSize="14" fontWeight="bold" fill="#EF4444">{'\u2715'}</text>
              <circle cx="290" cy="148" r="14" fill="#FEE2E2" />
              <text x="284" y="154" fontSize="14" fontWeight="bold" fill="#EF4444">{'\u2715'}</text>
              <circle cx="175" cy="230" r="14" fill="#FEE2E2" />
              <text x="169" y="236" fontSize="14" fontWeight="bold" fill="#EF4444">{'\u2715'}</text>
              {/* Tiny decorative dots */}
              <circle cx="30" cy="200" r="3" fill="#E5E7EB" />
              <circle cx="320" cy="60" r="3" fill="#E5E7EB" />
              <circle cx="340" cy="200" r="4" fill="#EDE9FE" />
              <circle cx="15" cy="130" r="4" fill="#EDE9FE" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
