"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface SocialProofSectionProps {
  learnerCount: number;
}

const leaderboard = [
  { name: "Sarah K.", streak: 42, xp: 3_280 },
  { name: "Marcus T.", streak: 31, xp: 2_540 },
  { name: "Aisha R.", streak: 27, xp: 2_110 },
];

export function SocialProofSection({ learnerCount }: SocialProofSectionProps) {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Join{" "}
            <span className="text-primary">
              {learnerCount.toLocaleString()}
            </span>{" "}
            Learners This Week
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See how others are building their learning streaks.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-10 max-w-md"
        >
          <Card>
            <CardContent className="divide-y px-6 py-2">
              {leaderboard.map((entry, i) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="font-medium">{entry.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      <span className="mr-1">{"🔥"}</span>
                      {entry.streak} days
                    </span>
                    <span className="font-medium text-foreground">
                      {entry.xp.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
