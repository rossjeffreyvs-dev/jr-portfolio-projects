const portfolioBaseUrl = "https://jeffrey-ross.me";

export default function ProjectFooter({ projectName = "Train Jazz Agent" }: { projectName?: string }) {
  return (
    <footer className="project-footer">
      <div className="project-footer-inner">
        <div className="footer-brand-block">
          <a href={portfolioBaseUrl} className="footer-brand" aria-label="JR Projects home">
            <span className="footer-brand-mark">JR</span>
            <span>Projects</span>
          </a>
          <p>Applied AI, data platform, and workflow demos by Jeffrey Ross.</p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <div>
            <h3>Portfolio</h3>
            <a href={`${portfolioBaseUrl}/`}>Home</a>
            <a href={`${portfolioBaseUrl}/projects`}>Projects</a>
            <a href={`${portfolioBaseUrl}/blog`}>Blog</a>
          </div>
          <div>
            <h3>About</h3>
            <a href={`${portfolioBaseUrl}/about`}>Profile</a>
            <a href={`${portfolioBaseUrl}/contact`}>Contact</a>
          </div>
          <div>
            <h3>Social</h3>
            <a href="https://www.linkedin.com/in/jeffrey-ross1">LinkedIn</a>
            <a href="https://github.com/rossjeffreyvs-dev">GitHub</a>
          </div>
        </nav>
      </div>
      <div className="project-footer-bottom">© {new Date().getFullYear()} {projectName}. All rights reserved.</div>
    </footer>
  );
}
