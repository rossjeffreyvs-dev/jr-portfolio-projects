export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand" href="/projects" aria-label="Projects home">
          <span className="brand-mark">JR</span>
          <span className="brand-text">Projects</span>
        </a>
        <nav className="top-nav" aria-label="Primary navigation">
          <a href="/">Home</a>
          <a className="active" href="/projects">Projects</a>
          <a href="/blog">Blog</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
