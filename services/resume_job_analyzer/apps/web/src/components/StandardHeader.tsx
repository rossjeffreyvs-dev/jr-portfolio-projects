"use client";

"use client";

import { useState } from "react";

export default function StandardHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="https://www.jeffrey-ross.me/projects" className="brand-link">
          <div className="brand">
            <div className="brand-mark">JR</div>
            <div>Projects</div>
          </div>
        </a>

        <button
          className="mobile-menu-button"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`top-nav ${open ? "is-open" : ""}`}
          aria-label="Project navigation"
        >
          <a href="https://www.jeffrey-ross.me">Home</a>
          <a href="https://www.jeffrey-ross.me/projects" className="active">
            Projects
          </a>
          <a href="https://www.jeffrey-ross.me/blog">Blog</a>
          <a href="https://www.jeffrey-ross.me/about">About</a>
          <a href="https://www.jeffrey-ross.me/contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
