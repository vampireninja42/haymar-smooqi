"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: "🌍",
    title: "Learn Anything",
    description:
      "Choose from 195+ topics spanning science, history, psychology, cooking, music, and more. There is always something new to discover.",
  },
  {
    icon: "🔥",
    title: "Build the Habit",
    description:
      "Daily streaks, XP, and achievements keep you motivated. Most users build a lasting learning habit within two weeks.",
  },
  {
    icon: "🧠",
    title: "Actually Remember It",
    description:
      "Spaced repetition, quizzes, and word games are built into every lesson so you retain what you learn for good.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function BenefitsSection() {
  return (
    <section className="bg-muted/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why Learners Love Smooqi
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {benefits.map((benefit) => (
            <motion.div key={benefit.title} variants={cardVariants}>
              <Card className="h-full text-center">
                <CardContent className="flex flex-col items-center gap-4 pt-2">
                  <span className="text-4xl">{benefit.icon}</span>
                  <h3 className="text-lg font-semibold">{benefit.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
