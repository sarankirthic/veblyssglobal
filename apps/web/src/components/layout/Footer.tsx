import Link from "next/link";
import { getSettings } from "@/lib/data";

export async function Footer() {
  const settings = await getSettings();
  const contact = settings.contact_details ?? {};

  return (
    <footer>
      <div className="wrap foot-grid">
        <div>
          <Link href="/" className="wordmark" style={{ fontSize: 17 }}>
            Ve<b>B</b>lyss
          </Link>
          <p>Authentic Indian craftsmanship, handmade for modern homes.</p>
          <div className="foot-social">
            <span>LINKEDIN</span>
            <span>FACEBOOK</span>
            <span>INSTAGRAM</span>
          </div>
        </div>

        <div>
          <div className="foot-col-title">Quick links</div>
          <div className="foot-links">
            <Link href="/about">About</Link>
            <Link href="/products">Products</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/occasions">Shop by Occasion</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <div className="foot-col-title">Bengaluru studio</div>
          <p className="foot-addr">
            VeBlyss Global Pvt Ltd
            <br />
            2619, 36th A Cross, 26th Main
            <br />
            4th T Block, Jayanagar
            <br />
            Bengaluru, KA 560041
            <br />
            {contact.phone ?? "+91 80 2658 2427"}
          </p>
        </div>

        <div>
          <div className="foot-col-title">London studio</div>
          <p className="foot-addr">
            VeBlyss Limited
            <br />
            71–75 Shelton Street
            <br />
            Covent Garden
            <br />
            London WC2H 9JQ
            <br />
            {contact.whatsapp ?? "+44 7722 184477"}
          </p>
          <div className="foot-download">
            <Link href="/contact#lookbook" style={{ color: "inherit" }}>
              Browse Our Lookbook
            </Link>
          </div>
        </div>
      </div>

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
