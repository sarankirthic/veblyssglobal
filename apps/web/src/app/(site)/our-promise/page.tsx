import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/layout/CtaBand";

export const metadata: Metadata = {
  title: "Our Promise — VeBlyss",
  description:
    "What actually stands behind every VeBlyss piece — named artisan communities, honest materials, hand inspection, and real safety standards.",
};

const PILLARS = [
  {
    n: "01",
    title: "Named Artisan Communities",
    body: "Every product line traces to a specific region and workshop — Dharavi for leather, Moradabad for copper, Jaipur for jewellery. Not “made in India” — made by these people, in this place.",
  },
  { n: "02", title: "Material Honesty", body: "Full-grain leather. Food-grade copper. Natural fibres. We name the material, not just the category." },
  {
    n: "03",
    title: "Hand-Inspected, Every Time",
    body: "Every piece is checked by hand before it's packed — for finish, safety and fit. If it doesn't meet the standard, it doesn't ship.",
  },
  {
    n: "04",
    title: "Safety Standards That Apply",
    body: "Copperware and food-adjacent items meet FSSAI food-safety standards; materials meet relevant international marks including CE, REACH and ISO where applicable.",
  },
  {
    n: "05",
    title: "Plastic-Free, Wherever Possible",
    body: "Recyclable, plastic-reduced packaging as standard — considered from workshop to doorstep.",
  },
];

export default function OurPromisePage() {
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Our Promise
          </div>
          <h1>Our Promise</h1>
          <p>
            We know &quot;ethically sourced&quot; and &quot;handmade&quot; get used until they mean nothing. Here&apos;s
            exactly what stands behind every VeBlyss piece — and where you can check for yourself.
          </p>
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="section-head">
            <h2>Five things we stand behind</h2>
            <span className="meta">Ask us for detail on any of them</span>
          </div>
          <div className="certgrid">
            {PILLARS.map((p) => (
              <div className="cert" key={p.n}>
                <div className="mark">{p.n}</div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
          <p className="lede" style={{ marginTop: 30 }}>
            Want more detail on how a specific piece is made? Ask us — we&apos;re happy to share.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
