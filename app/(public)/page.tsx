import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { themeConfig } from "@/lib/theme";
import { HeroSection } from "@/components/marketing/HeroSection";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { SolutionSection } from "@/components/marketing/SolutionSection";
import { BenefitsSection } from "@/components/marketing/BenefitsSection";
import { SocialProofSection } from "@/components/marketing/SocialProofSection";
import { CtaSection } from "@/components/marketing/CtaSection";
import { FaqSection } from "@/components/marketing/FaqSection";

import { VbHero } from "@/components/marketing/vb/VbHero";
import { VbManifesto } from "@/components/marketing/vb/VbManifesto";
import { VbHowItWorks } from "@/components/marketing/vb/VbHowItWorks";
import { VbTopics } from "@/components/marketing/vb/VbTopics";
import { VbTestimonials } from "@/components/marketing/vb/VbTestimonials";
import { VbCta } from "@/components/marketing/vb/VbCta";

export const dynamic = 'force-dynamic'

export default async function MarketingHomePage() {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    redirect('/home')
  }

  let learnerCount = 0
  try {
    const realCount = await prisma.user.count()
    // Show a minimum floor so the counter looks credible at launch
    learnerCount = Math.max(realCount, 1200)
  } catch {
    learnerCount = 1200
  }

  if (themeConfig.isVB) {
    return (
      <>
        <VbHero />
        <VbManifesto />
        <VbHowItWorks />
        <VbTopics />
        <VbTestimonials learnerCount={learnerCount} />
        <VbCta />
      </>
    )
  }

  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection learnerCount={learnerCount} />
      <BenefitsSection />
      <SocialProofSection learnerCount={learnerCount} />
      <CtaSection />
      <FaqSection />
    </>
  );
}
