import Link from 'next/link'
import { prisma } from '@/lib/db'
import { BackButton } from '@/components/ui/BackButton'
import { TopicIllustration } from '@/components/blog/TopicIllustration'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: 'desc' },
  })

  const featured = posts.find((p) => p.featured)
  const rest = posts.filter((p) => p.id !== featured?.id)

  return (
    <div className="mx-auto max-w-5xl">
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
        <Link href={`/blog/${featured.slug}`} className="mb-8 block">
          <div className="rounded-2xl overflow-hidden glass-card flex flex-col md:flex-row gap-0 hover:shadow-lg transition-shadow">
            <TopicIllustration topic={featured.topic} className="h-48 md:h-auto md:w-64 flex-shrink-0" />
            <div className="p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>
                  {featured.topic}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2 mb-3">{featured.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-3">{featured.excerpt}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-400">
                  {featured.readingTime} min read &middot;{' '}
                  {new Date(featured.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>Read &rarr;</span>
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
    </div>
  )
}
