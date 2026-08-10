import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";

export const metadata: Metadata = {
  title: "Certifications — VeBlyss",
  description:
    "The registrations and certifications behind VeBlyss's products and export operations — compliance you can check for yourself.",
};

const CERTIFICATIONS = [
  { n: "01", title: "Import Export Code (IEC)", body: "The registration required to import or export from India — issued by the Directorate General of Foreign Trade." },
  { n: "02", title: "FSSAI", body: "Food Safety and Standards Authority of India license, covering our food and pantry products." },
  { n: "03", title: "APEDA", body: "Agricultural & Processed Food Products Export Development Authority registration, for exporting food and agri products." },
  { n: "04", title: "Spices Board", body: "Registration required to export spices from India, covering our curated Indian essentials line." },
  { n: "05", title: "Tea Board", body: "Registration required to export tea from India." },
  { n: "06", title: "FIEO", body: "Federation of Indian Export Organisations membership, supporting our export trade operations." },
  { n: "07", title: "GST", body: "Goods and Services Tax registration." },
  { n: "08", title: "DGFT", body: "Directorate General of Foreign Trade registration, covering our import-export operations." },
  { n: "09", title: "MSME Udyam", body: "Micro, Small & Medium Enterprises registration." },
  { n: "10", title: "CE Marking", body: "Conformité Européenne marking, for products sold in the European Economic Area." },
  { n: "11", title: "RoHS", body: "Restriction of Hazardous Substances compliance, covering materials and components." },
  { n: "12", title: "FDA", body: "U.S. Food and Drug Administration compliance, where applicable to our products." },
  { n: "13", title: "ISO", body: "International Organization for Standardization certification for quality and process standards." },
  { n: "14", title: "REACH", body: "EU Registration, Evaluation, Authorisation and Restriction of Chemicals compliance." },
  { n: "15", title: "Phytosanitary Certificate", body: "Confirms plant-based goods meet the importing country's health and quarantine requirements." },
  { n: "16", title: "Certificate of Origin (COO)", body: "Confirms the country where goods were manufactured, required by many importing countries." },
];

export default function CertificationsPage() {
  return (
    <>
      <PageHero
        crumb="Certifications"
        title="Compliance You Can Check For Yourself"
        description="Exporting handmade goods across borders means meeting real regulatory standards, not just making claims. Here's every registration and certification behind VeBlyss's products and export operations."
      />

      <section>
        <div className="wrap">
          <div className="section-head">
            <h2>16 Certifications & Registrations</h2>
            <span className="meta">Ask us for detail or documentation on any of them</span>
          </div>
          <div className="certgrid">
            {CERTIFICATIONS.map((c) => (
              <div className="cert" key={c.n}>
                <div className="mark">{c.n}</div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
