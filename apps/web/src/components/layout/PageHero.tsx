import Link from "next/link";

export function PageHero({
  crumb,
  title,
  description,
  children,
}: {
  crumb: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-hero">
      <div className="wrap">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / {crumb}
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </div>
    </div>
  );
}
