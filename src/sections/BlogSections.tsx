
import React from 'react';
import type { SectionProps } from './registry';

export const BlogListSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Latest Posts";
  const posts = data.posts || [];
  
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-[hsl(var(--theme-primary))]">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any, i: number) => (
            <article key={i} className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-3 text-[hsl(var(--theme-primary))]">
                {post.title || `Post ${i + 1}`}
              </h3>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <div className="text-sm text-muted-foreground">
                {post.date || "Recent"}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export const NewsletterSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Subscribe to Newsletter";
  const description = data.description || "Stay updated with our latest news";
  
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)] bg-muted/50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-[hsl(var(--theme-primary))]">{title}</h2>
        <p className="text-lg mb-8 text-muted-foreground">{description}</p>
        <div className="flex gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-lg border bg-background"
          />
          <button className="bg-[hsl(var(--theme-primary))] hover:bg-[hsl(var(--theme-primary-dark))] text-white px-6 py-2 rounded-lg font-semibold">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export const PostHeroSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Blog Post Title";
  const subtitle = data.subtitle || "Post subtitle or excerpt";
  const date = data.date || "Recent";
  const author = data.author || "Author";
  
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-[hsl(var(--theme-primary))]">{title}</h1>
        <p className="text-xl mb-6 text-muted-foreground">{subtitle}</p>
        <div className="flex items-center justify-center gap-4 text-muted-foreground">
          <span>By {author}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
      </div>
    </section>
  );
};

export const AuthorBioSection: React.FC<SectionProps> = ({ data }) => {
  const author = data.author || {};
  
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-4xl mx-auto">
        <div className="p-6 rounded-lg border bg-card">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-[hsl(var(--theme-primary))]/20 rounded-full flex items-center justify-center">
              <span className="text-[hsl(var(--theme-primary))] font-semibold text-lg">
                {(author.name || "A")[0]}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{author.name || "Author"}</h3>
              <p className="text-muted-foreground">{author.bio || "Author bio"}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ShareSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Share this post";
  
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-xl font-semibold mb-4 text-[hsl(var(--theme-primary))]">{title}</h3>
        <div className="flex justify-center gap-4">
          <button className="px-4 py-2 rounded-lg border bg-card hover:bg-muted">Twitter</button>
          <button className="px-4 py-2 rounded-lg border bg-card hover:bg-muted">LinkedIn</button>
          <button className="px-4 py-2 rounded-lg border bg-card hover:bg-muted">Facebook</button>
        </div>
      </div>
    </section>
  );
};

export const RelatedPostsSection: React.FC<SectionProps> = ({ data }) => {
  const title = data.title || "Related Posts";
  const posts = data.posts || [];
  
  return (
    <section className="py-[var(--theme-spacing-section)] px-[var(--theme-spacing-content)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-[hsl(var(--theme-primary))]">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post: any, i: number) => (
            <article key={i} className="p-6 rounded-lg border bg-card">
              <h3 className="text-lg font-semibold mb-3 text-[hsl(var(--theme-primary))]">
                {post.title || `Related Post ${i + 1}`}
              </h3>
              <p className="text-muted-foreground">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
