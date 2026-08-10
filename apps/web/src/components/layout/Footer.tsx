import Link from "next/link";
import { getSettings } from "@/lib/data";

export async function Footer() {
  const settings = await getSettings();
  const contact = settings.contact_details ?? {};
  const locations = contact.locations ?? [];

  return (
    <footer>
      <div
        className="wrap foot-grid"
        style={locations.length !== 2 ? { gridTemplateColumns: `1.2fr 0.8fr repeat(${Math.max(1, locations.length)}, 1fr)` } : undefined}
      >
        <div>
          <Link href="/" className="wordmark" style={{ fontSize: 17 }}>
            Ve<b>B</b>lyss
          </Link>
          <p>Authentic Indian craftsmanship, handmade for modern homes.</p>
          <div className="foot-social">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/linkedin.svg" alt="LinkedIn" width={25} height={25} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/facebook.svg" alt="Facebook" width={25} height={25} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/instagram.svg" alt="Instagram" width={25} height={25} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/whatsapp.svg" alt="WhatsApp" width={25} height={25} />
          </div>
        </div>

        <div>
          <div className="foot-col-title">Quick links</div>
          <div className="foot-links">
            <Link href="/about">About</Link>
            <Link href="/products">Products</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/certifications">Certifications</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        {locations.map((loc) => (
          <div key={loc.id}>
            <div className="foot-col-title">{loc.city} office</div>
            <p className="foot-addr">
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
      </div>
      {/*<div className="wrap foot-download">*/}
      {/*  <Link href="/contact#lookbook" style={{ color: "inherit" }}>*/}
      {/*    Browse Our Lookbook*/}
      {/*  </Link>*/}
      {/*</div>*/}

      <div className="wrap foot-bottom">
        <span>© {new Date().getFullYear()} VeBlyss Global</span>
        <span className="legal">
          <span>Privacy Policy</span>
          <span>Terms</span>
          <span>Cookie preferences</span>
        </span>
      </div>
    </footer>
  );
}
