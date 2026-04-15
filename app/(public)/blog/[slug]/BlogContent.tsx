'use client'

import ReactMarkdown from 'react-markdown'

export function BlogContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="mt-8 mb-4 text-2xl font-bold text-gray-900">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-6 mb-3 text-xl font-bold text-gray-900">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-5 mb-2 text-lg font-bold text-gray-900">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="mb-4 text-base leading-7 text-gray-700">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mb-4 list-disc space-y-1 pl-6 text-gray-700">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-4 list-decimal space-y-1 pl-6 text-gray-700">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-base leading-7">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mb-4 border-l-4 border-purple-300 pl-4 italic text-gray-600">
            {children}
          </blockquote>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900">{children}</strong>
        ),
        a: ({ href, children }) => (
          <a href={href} className="text-purple-600 underline hover:text-purple-800">
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
