import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { ContentLayout } from '../components/ContentLayout';
import { blogPosts } from '../data/blogs';

const NAVY = '#0a1f3d';
const TEAL = '#009689';

export function BlogsPage() {
  return (
    <ContentLayout
      eyebrow="Anphonic Shop Blog"
      title={<>Reads on <em style={{ color: TEAL }}>D2C discovery.</em></>}
      subtitle="Notes on new-age brands, standout offers, and how curated commerce works."
    >
      <div className="space-y-6">
        {blogPosts.map(post => (
          <Link
            key={post.slug}
            to={`/blogs/${post.slug}`}
            className="group block p-6 rounded-2xl bg-white transition-all duration-200"
            style={{ border: '1px solid rgba(10,31,61,0.08)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,150,137,0.3)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(10,31,61,0.08)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,31,61,0.08)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <h2
              className="text-xl md:text-2xl font-light leading-snug mb-2"
              style={{ color: NAVY, fontFamily: "'Fraunces', serif" }}
            >
              {post.title}
            </h2>
            <p className="text-sm md:text-base leading-relaxed mb-4" style={{ color: '#5a7a9a' }}>
              {post.metaDescription}
            </p>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest transition-transform duration-200 group-hover:translate-x-1"
              style={{ color: TEAL }}
            >
              Read more <ArrowRight className="size-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </ContentLayout>
  );
}
