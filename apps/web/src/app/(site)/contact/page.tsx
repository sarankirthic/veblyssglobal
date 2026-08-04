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
            <div className="office-card">
              <div className="lbl">Our Studio in Bengaluru</div>
              <p>
                VeBlyss Global Pvt Ltd
                <br />
                2619, 36th A Cross, 26th Main
                <br />
                4th T Block, 9th Block Post, Jayanagar
                <br />
                Bengaluru, Karnataka - 560041
                <br />
                {contact.phone ?? "+91 80 2658 2427 / +91 98448 44225"}
              </p>
            </div>
            <div className="office-card">
              <div className="lbl">Our Studio in London</div>
              <p>
                VeBlyss Limited
                <br />
                71–75 Shelton Street
                <br />
                Covent Garden
                <br />
                London, WC2H 9JQ, United Kingdom
                <br />
                {contact.whatsapp ?? "+44 7722 184477"} (also WhatsApp)
              </p>
            </div>
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
              <a className="btn btn-outline btn-sm" href="#lookbook" id="lookbook">
                Browse Our Lookbook
              </a>
            </div>
            <p className="response-note">We respond within 24 hours · LinkedIn · Facebook · Instagram</p>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div className="wrap mg">
          <div>
            <h2 style={{ fontSize: 22 }}>Bengaluru studio</h2>
            <div className="swatch" style={{ height: 220, marginTop: 16 }} aria-hidden="true">
              <span>Bengaluru, Karnataka — embedded map placeholder</span>
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: 22 }}>London studio</h2>
            <div className="swatch" style={{ height: 220, marginTop: 16 }} aria-hidden="true">
              <span>Covent Garden, London — embedded map placeholder</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
