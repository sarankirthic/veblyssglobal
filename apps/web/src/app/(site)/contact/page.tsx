import type { Metadata } from "next";
import { getCategories, getSettings } from "@/lib/data";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact — VeBlyss",
  description:
    "Get in touch with VeBlyss — questions about a piece, sizing, care, or a gift order. Bengaluru and London studios, WhatsApp, and email.",
};

export default async function ContactPage() {
  const [categories, settings] = await Promise.all([getCategories(), getSettings()]);
  const contact = settings.contact_details ?? {};
  const locations = contact.locations ?? [];

  return (
    <>
      <div className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">Home / Contact</div>
          <h1>Let&apos;s Talk</h1>
          <p>One team across Bengaluru and London — reach out about an order, a custom request, or just to ask a question.</p>
        </div>
      </div>

      <section>
        <div className="wrap contact-grid">
          <div>
            <h2 style={{ fontSize: 24 }}>Send Us a Message</h2>
            <ContactForm categories={categories} />
          </div>

          <div>
            {locations.map((loc) => (
              <div className="office-card" key={loc.id}>
                <div className="lbl">Our Office in {loc.city}</div>
                <p>
                  {loc.companyName}
                  {loc.address.split("\n").map((line, i) => (
                    <span key={i}>
                      <br />
                      {line}
                    </span>
                  ))}
                  <br />
                  {loc.phone ?? contact.phone ?? ""}
                </p>
              </div>
            ))}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a className="btn btn-primary btn-sm" href={`mailto:${contact.email ?? "info@veblyssglobal.com"}`}>
                Email Us
              </a>
              <a
                className="btn btn-outline btn-sm"
                href="https://wa.me/447722184477"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
              {/*<a className="btn btn-outline btn-sm" href="#lookbook" id="lookbook">*/}
              {/*  Browse Our Lookbook*/}
              {/*</a>*/}
            </div>
            <p className="response-note">We respond within 24 hours · LinkedIn · Facebook · Instagram</p>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div className="wrap mg">
          {locations.map((loc) => (
            <div key={loc.id}>
              <h2 style={{ fontSize: 22 }}>{loc.city} studio</h2>
              <div className="swatch" style={{ height: 220, marginTop: 16 }} aria-hidden="true">
                <span>{loc.city} — embedded map placeholder</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
