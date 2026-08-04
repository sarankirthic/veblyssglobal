"use client";

/** Replicates assets/nav.js: toggle .open on #navlinks, close on link click. */
export function MobileNavToggle() {
  const toggle = () => {
    document.getElementById("navlinks")?.classList.toggle("open");
  };

  return (
    <button className="menu-btn" id="menuBtn" aria-label="Toggle menu" onClick={toggle}>
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
}
