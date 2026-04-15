import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: 'desc' },
  })

  const featured = posts.find((p) => p.featured)
  const rest = posts.filter((p) => p.id !== featured?.id)

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          The Smooqi Blog
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          Tips, insights, and stories about lifelong learning.
        </p>
      </div>

      {posts.length === 0 && (
        <p className="mt-12 text-center text-gray-400">No posts yet. Check back soon!</p>
      )}

      {featured && (
        <Link href={`/blog/${featured.slug}`} className="mt-12 block">
          <Card className="overflow-hidden transition-shadow hover:shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <Badge variant="secondary" className="mb-3">
                {featured.topic}
              </Badge>
              <h2 className="text-2xl font-bold text-gray-900">{featured.title}</h2>
              <p className="mt-2 line-clamp-3 text-gray-600">{featured.excerpt}</p>
              <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
                <span>{featured.readingTime} min read</span>
                <span>&middot;</span>
                <span>
                  {new Date(featured.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {rest.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-lg">
                <CardContent className="p-5">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {post.topic}
                  </Badge>
                  <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">{post.excerpt}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                    <span>{post.readingTime} min read</span>
                    <span>&middot;</span>
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
