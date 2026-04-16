import Link from 'next/link'
import { prisma } from '@/lib/db'
import { BackButton } from '@/components/ui/BackButton'
import { TopicIllustration } from '@/components/blog/TopicIllustration'
import { EmailSignup } from '@/components/blog/EmailSignup'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: 'desc' },
  })

  const featured = posts.find((p) => p.featured)
  const rest = posts.filter((p) => p.id !== featured?.id)

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-3xl bg-white/80 backdrop-blur-sm px-6 py-8 md:px-10 md:py-10 shadow-sm">
      <BackButton href="/" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">The Smooqi Blog</h1>
        <p className="text-gray-500 mt-2">Ideas, insights, and the science behind better learning.</p>
      </div>

      {posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">{'\u270D\uFE0F'}</p>
          <p className="text-lg font-semibold text-gray-900">Coming soon</p>
          <p className="text-sm text-gray-500 mt-2">We&apos;re working on our first posts. Check back soon!</p>
        </div>
      )}

      {featured && (
        <Link href={`/blog/${featured.slug}`} className="mb-10 block group">
          <div className="rounded-2xl overflow-hidden glass-card hover:shadow-xl transition-shadow">
            <div className="relative h-64 w-full">
              <TopicIllustration topic={featured.topic} className="h-64 w-full rounded-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
                  {featured.topic}
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">{featured.title}</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm line-clamp-2">{featured.excerpt}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-400">
                  {featured.readingTime} min read &middot;{' '}
                  {new Date(featured.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-xs font-semibold group-hover:underline" style={{ color: 'var(--color-primary)' }}>Read &rarr;</span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-shadow block">
              <TopicIllustration topic={post.topic} className="h-40 w-full" />
              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>
                  {post.topic}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-1.5 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-400">{post.readingTime} min read</span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>Read &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Email signup */}
      <div className="mt-16 rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)' }}>
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white">Get smarter every week</h3>
        <p className="mt-2 text-sm text-white/80">Join 10,000+ learners. One article + one actionable tip, every Tuesday.</p>
        <EmailSignup />
      </div>
      </div>
    </div>
  )
}
