"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need a credit card to start?",
    answer:
      "No credit card required to start your 7-day free trial. You'll get full access to everything — all courses, audio mode, word games, achievements, and progress tracking. After your trial, choose a monthly or annual plan to continue.",
  },
  {
    question: "How long are the lessons?",
    answer:
      "Each lesson takes about 15 minutes. They are designed to fit into your day — during a coffee break, on your commute, or before bed. Short enough to stay consistent, long enough to actually learn something.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      "Smooqi is fully optimized for mobile browsers, so you can learn on any device. Native iOS and Android apps are coming soon with offline support and push notifications for your daily reminder.",
  },
  {
    question: "What if I miss a day?",
    answer:
      "Life happens! Your streak will pause, but you can use a streak freeze to protect it. Premium members get automatic streak freezes. Missing a day does not affect your course progress — just pick up where you left off.",
  },
];

export function FaqSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-2xl"
        >
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={String(i)}>
                <AccordionTrigger className="text-base font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
