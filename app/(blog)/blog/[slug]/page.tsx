import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { BlogContent } from './BlogContent'
import { BackButton } from '@/components/ui/BackButton'
import { TopicIllustration } from '@/components/blog/TopicIllustration'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post) redirect('/blog')

  const related = await prisma.blogPost.findMany({
    where: { id: { not: post.id } },
    orderBy: { publishedAt: 'desc' },
    take: 2,
  })

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl bg-white/80 backdrop-blur-sm px-6 py-8 md:px-10 md:py-10 shadow-sm">
      <BackButton href="/blog" label="Back to Blog" />

      <TopicIllustration topic={post.topic} className="h-48 w-full mb-6 rounded-2xl" />

      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>
          {post.topic}
        </span>
        <span className="text-sm text-gray-400">{post.readingTime} min read</span>
      </div>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {post.title}
      </h1>

      <p className="mt-2 text-sm text-gray-400">
        Published{' '}
        {new Date(post.publishedAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>

      <div className="mt-8">
        <BlogContent content={post.content} />
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900">Related Posts</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <Link key={r.id} href={`/blog/${r.slug}`} className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-shadow block">
                <TopicIllustration topic={r.topic} className="h-32 w-full" />
                <Card className="border-0 shadow-none">
                  <CardContent className="p-4">
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>
                      {r.topic}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-1">{r.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">{r.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
