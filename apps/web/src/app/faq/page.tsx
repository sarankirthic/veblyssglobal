import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/layout/CtaBand";

export const metadata: Metadata = {
  title: "FAQ — VeBlyss",
  description: "Answers on shipping, returns, care, materials and gifting for VeBlyss customers.",
};

const FAQ_GROUPS = [
  {
    title: "Ordering & Shipping",
    items: [
      {
        q: "Do you ship internationally?",
        a: "Yes — we currently ship to the UK, Europe, the Middle East, North America and Asia-Pacific, with tracked delivery on every order.",
      },
      {
        q: "How long will my order take to arrive?",
        a: "Delivery time is confirmed with your order — reach out and we'll give you a clear estimate before you commit.",
      },
      { q: "Can I order more than one of something?", a: "Yes — reach out and we'll sort out quantities, whether it's one piece or several." },
      {
        q: "What if my piece doesn't match the photos?",
        a: "Every piece is hand-inspected before it ships. If something's not right when it arrives, contact us and we'll make it right.",
      },
    ],
  },
  {
    title: "Returns & Care",
    items: [
      { q: "What's your return policy?", a: "[Return window and condition requirements to be confirmed — contact us and we'll walk you through it for your order.]" },
      {
        q: "How do I care for leather and copper pieces?",
        a: "Each product page includes care instructions specific to that piece. As a general rule: keep leather conditioned and out of direct sun, and let copper darken naturally rather than over-polishing it.",
      },
    ],
  },
  {
    title: "Payments",
    items: [
      { q: "What payment methods do you accept?", a: "[Accepted payment methods to be confirmed — contact us for current options.]" },
      { q: "Do you charge in my local currency?", a: "[To be confirmed — ask us when you reach out.]" },
    ],
  },
  {
    title: "Materials & Sourcing",
    items: [
      { q: "Is this really handmade?", a: "Yes — every piece passes through an artisan's hands. Expect natural variation, not machine-perfect uniformity." },
      { q: "Where are your products made?", a: "Each category traces to a named craft region — leather from Dharavi, copper from Moradabad, jewellery from Jaipur, and more." },
      {
        q: "Are your materials safe?",
        a: "Yes — food-adjacent items meet FSSAI food-safety standards, and materials meet relevant international safety marks including CE, REACH and ISO where applicable.",
      },
    ],
  },
  {
    title: "Gifting",
    items: [
      { q: "Can you gift-wrap an order?", a: "[To be confirmed — ask us when you reach out, especially for a gift order.]" },
      { q: "Can I include a note with a gift?", a: "[To be confirmed — mention it in your message and we'll do our best to accommodate.]" },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / FAQ
          </div>
          <h1>Frequently asked questions</h1>
          <p>
            Grouped by topic — ordering, returns, materials and gifting. Still have a question?{" "}
            <Link href="/contact" className="accent">
              Contact us
            </Link>
            .
          </p>
        </div>
      </div>

      <section>
        <div className="wrap" style={{ maxWidth: 820 }}>
          {FAQ_GROUPS.map((group, gi) => (
            <div className="faqgroup" key={group.title}>
              <h3>{group.title}</h3>
              {group.items.map((item, ii) => (
                <details className="faq-item" key={item.q} open={gi === 0 && ii === 0}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
