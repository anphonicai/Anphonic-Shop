import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { ContentLayout } from '../components/ContentLayout';
import { blogPosts } from '../data/blogs';

const TEAL = '#009689';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium" style={{ color: '#0a1f3d' }}>Post not found</p>
        <Link to="/blogs" className="text-sm font-medium" style={{ color: TEAL }}>
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <ContentLayout
      eyebrow="Anphonic Shop Blog"
      title={post.title}
      subtitle={post.metaDescription}
    >
      <Link
        to="/blogs"
        className="inline-flex items-center gap-2 text-sm font-medium transition-colors mb-8"
        style={{ color: '#5a7a9a' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#0a1f3d')}
        onMouseLeave={e => (e.currentTarget.style.color = '#5a7a9a')}
      >
        <ArrowLeft className="size-4" /> Back to the blog
      </Link>

      <div className="space-y-6 text-sm md:text-base leading-relaxed" style={{ color: '#4a5f78' }}>
        {post.paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </ContentLayout>
  );
}
