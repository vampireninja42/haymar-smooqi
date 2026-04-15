"use client";

import { motion } from "framer-motion";

interface SolutionSectionProps {
  learnerCount: number;
}

export function SolutionSection({ learnerCount }: SolutionSectionProps) {
  return (
    <section id="solution" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            One Lesson a Day. That&apos;s It.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Every day, you get a single 15-minute lesson on one topic you care
            about. No overwhelm, no decision fatigue. Just open the app, learn
            something fascinating, and get on with your day.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Over weeks and months, those small sessions add up to real,
            lasting knowledge across every subject you&apos;re curious about.
          </p>
          <p className="mt-8 text-base font-medium text-primary">
            Join{" "}
            <span className="text-lg font-bold">
              {learnerCount.toLocaleString()}
            </span>{" "}
            people building smarter habits
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {[
            {
              icon: '\u26A1',
              title: '5\u201315 min lessons',
              desc: 'Bite-sized so you actually finish them. No more half-read articles.',
            },
            {
              icon: '\uD83D\uDD25',
              title: 'Streaks & XP',
              desc: 'Game mechanics that make daily learning feel like progress, not homework.',
            },
            {
              icon: '\uD83E\uDDE0',
              title: '195+ topics',
              desc: 'From quantum physics to confident parenting. One app, every curiosity.',
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
              <span className="text-4xl">{f.icon}</span>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
