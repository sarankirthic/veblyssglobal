"use client";

/** Closes the mobile menu when any nav link is clicked (delegated, so Header
 * itself can stay a server component). Mirrors assets/nav.js. */
export function NavLinksContainer({ children }: { children: React.ReactNode }) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a")) {
      document.getElementById("navlinks")?.classList.remove("open");
    }
  };

  return (
    <nav className="navlinks" id="navlinks" onClick={handleClick}>
      {children}
    </nav>
  );
}
