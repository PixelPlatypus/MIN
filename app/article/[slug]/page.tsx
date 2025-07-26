import { Metadata } from 'next';
import fs from 'fs/promises';
import path from 'path';

export const metadata: Metadata = {
  title: 'Article',
  description: 'Detailed article content',
};

import { MotionDivWrapper } from "@/components/motion-div-wrapper";

import { ArrowLeft, Calendar, User, Tag, Download } from "lucide-react"
import Link from "next/link"

import { Navigation } from "@/components/navigation";
import { ClientPdfRenderer } from '@/components/ui/client-pdf-renderer';
import { MinFloatingElements } from "@/components/ui/min-floating-elements";
import { Footer } from "@/components/footer"

interface ArticleData {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  tags: string[];
  slug: string;
  content?: string;
  downloadLink?: string;
  filePath?: string;
}

interface ArticlePageProps {
  params: { slug: string };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = params;

  const filePath = path.join(process.cwd(), 'data', 'content.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const allContent = JSON.parse(fileContents);

  const article = allContent.find((item: ArticleData) => item.category === "Article" && ((item.id && item.id.toString() === slug) || (item.slug && item.slug === slug)));

  if (article && !article.filePath && article.downloadLink) {
    article.filePath = article.downloadLink;
  }

  if (!article) {
    return (
      <div className="min-h-screen overflow-x-hidden">
        <Navigation />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Article Not Found</h1>
          <Link href="/content" className="btn-min-accent text-min-primary px-6 py-3 rounded-full">
            Back to Content
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { title, description, author, date, tags, content, downloadLink, filePath: articleFilePath } = article;

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* <MinFloatingElements /> */}

      {/* Navigation */}
      <Navigation />

      {/* Article Header */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto container-padding relative z-10">
          <MotionDivWrapper
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/content"
              className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors mb-8 group"
              data-hover="true"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Content</span>
            </Link>

            <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <span className="text-min-accent text-sm font-medium">Article</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 min-gradient-accent">
                {article.title}
              </h1>

              <p className="text-white/80 text-lg leading-relaxed mb-6">{article.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {(article.tags || []).map((tag: string, index: number) => (
                  <span key={index} className="glass px-3 py-1 rounded-full text-xs text-white/80 flex items-center">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </MotionDivWrapper>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-20 relative z-10">
        <div className="max-w-4xl mx-auto container-padding">
          <MotionDivWrapper
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8"
          >
            {articleFilePath ? (
              <ClientPdfRenderer filePath={articleFilePath.replace('/public', '')} className="text-white/90 leading-relaxed" />
            ) : (
              <p className="text-white/70">No PDF file available for this article.</p>
            )}
          </MotionDivWrapper>
          {article.downloadLink && (
            <div className="mt-8 text-center">
              <Link
                href={article.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white glass-button focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Article
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
