import Link from "next/link";

export function CtaBand({
  heading = "Ready to Bring a Piece Home?",
  note = "Questions about a piece, sizing, or a gift order? We reply within 24 hours.",
  contactLine = "info@veblyssglobal.com · +44 7722 184477 · +91 98448 44225",
  buttonLabel = "Get in Touch",
  buttonHref = "/contact",
}: {
  heading?: string;
  note?: string;
  contactLine?: string;
  buttonLabel?: string;
  buttonHref?: string;
}) {
  return (
    <div className="ctaband">
      <div className="wrap inner">
        <div>
          <h2>{heading}</h2>
          <p>{note}</p>
          <p>{contactLine}</p>
        </div>
        <Link className="btn btn-primary" href={buttonHref}>
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
}
