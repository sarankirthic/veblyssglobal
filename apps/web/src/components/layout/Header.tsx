import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/data";
import { NavLink } from "@/components/layout/NavLink";
import { NavLinksContainer } from "@/components/layout/NavLinksContainer";
import { MobileNavToggle } from "@/components/layout/MobileNavToggle";

export async function Header() {
  const categories = await getCategories();

  return (
    <header>
      <div className="wrap nav">
        <div className="brand">
          <Link href="/" className="brand-logo">
            <Image src="/wordmark.svg" alt="VeBlyss" width={93} height={56} className="logo" priority />
          </Link>
          <span className="est">India · UK</span>
        </div>

        <NavLinksContainer>
          <NavLink href="/about">About</NavLink>
          <span className="dropdown">
            Products
            <div className="dropdown-panel">
              {categories.length > 0 ? (
                categories.map((c) => (
                  <Link key={c.id} href={`/products/${c.slug}`}>
                    {c.name}
                  </Link>
                ))
              ) : (
                <Link href="/products">All Products</Link>
              )}
            </div>
          </span>
          <NavLink href="/gallery">Gallery</NavLink>
          <Link className="btn btn-primary" href="/contact">
            Get in Touch
          </Link>
        </NavLinksContainer>

        <MobileNavToggle />
      </div>
    </header>
  );
}
