export default function StandardHeader() {
  return (
    <header className="site-header">
      <a href="https://www.jeffrey-ross.me/projects" aria-label="JR Projects">
        <div className="brand">
          <div className="brand-mark">JR</div>
          <div>Projects</div>
        </div>
      </a>

      <nav className="top-nav" aria-label="Primary navigation">
        <a href="https://www.jeffrey-ross.me">Home</a>
        <a href="https://www.jeffrey-ross.me/projects" className="active">
          Projects
        </a>
        <a href="https://www.jeffrey-ross.me/blog">Blog</a>
        <a href="https://www.jeffrey-ross.me/about">About</a>
        <a href="https://www.jeffrey-ross.me/contact">Contact</a>
      </nav>
    </header>
  );
}
