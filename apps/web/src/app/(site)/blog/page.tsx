import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/layout/CtaBand";

export const metadata: Metadata = {
  title: "Stories & Guides — VeBlyss",
  description: "Care guides, artisan stories, and honest answers to the questions you'd ask before buying something handmade — from the VeBlyss team.",
};

const POSTS = [
  {
    tag: "GUIDE",
    title: "How to Care for Full-Grain Leather (So It Ages, Not Wears Out)",
    body: "What full-grain and vegetable-tanned leather actually need — conditioning, storage, and how to let a patina develop instead of fighting it.",
    date: "Aug 2026",
    category: "Care & Craft",
  },
  {
    tag: "GUIDE",
    title: "What “Handmade” Actually Means at VeBlyss",
    body: "A plain-language look at what happens between an artisan's hands and your doorstep — and why no two pieces are quite the same.",
    date: "Aug 2026",
    category: "Our Promise",
  },
  {
    tag: "STORY",
    title: "Inside Dharavi: The Leather Workshops Behind Our Bags",
    body: "A look at the artisan community in Dharavi, Mumbai, where our leather line is hand-finished before it ships.",
    date: "Jul 2026",
    category: "Craftsmanship",
  },
];

export default function BlogPage() {
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Blog
          </div>
          <h1>Stories &amp; Guides From VeBlyss</h1>
          <p>Care guides, artisan stories, and honest answers to the questions you&apos;d ask before buying something handmade.</p>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="cardgrid">
            {POSTS.map((p) => (
              <div className="card" key={p.title}>
                <div className="n">{p.tag}</div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <div className="links">
                  <span>{p.date}</span>
                  <span>{p.category}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="empty-state">
            <div className="eyebrow">More posts</div>
            <p>New guides publish as real buyer questions come in — see something missing? Ask us on the Contact page and we&apos;ll write it up.</p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
