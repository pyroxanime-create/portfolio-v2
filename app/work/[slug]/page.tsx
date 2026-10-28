import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { Footer } from "@/components/Sections";
import CaseStudy from "@/components/case/CaseStudy";
import { getProject, projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.seo.title,
    description: p.seo.description,
    openGraph: { title: `${p.seo.title} · Adam Calliste`, description: p.seo.description, images: [p.card.img] },
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  return (
    <div className="shell">
      <Header />
      <main id="main" className="main" tabIndex={-1}>
        <CaseStudy p={p} />
      </main>
      <Footer />
    </div>
  );
}
