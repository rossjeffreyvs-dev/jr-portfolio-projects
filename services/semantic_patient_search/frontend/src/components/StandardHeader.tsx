export default function StandardHeader() {
  return (
    <header className="siteHeader">
      <div className="siteHeaderInner">
        <a className="brandLockup" href="https://www.jeffrey-ross.me">
          <span className="brandBadge">JR</span>
          <span className="brandText">Projects</span>
        </a>

        <nav className="siteNav" aria-label="Primary navigation">
          <a href="https://www.jeffrey-ross.me">Home</a>
          <a className="active" href="https://www.jeffrey-ross.me/projects">
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
