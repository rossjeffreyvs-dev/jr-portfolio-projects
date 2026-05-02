type ProjectFooterProps = {
  projectName?: string;
  projectHref?: string;
};

const portfolioBaseUrl = "https://jeffrey-ross.me";

export default function ProjectFooter({
  projectName = "JR Projects",
  projectHref = portfolioBaseUrl,
}: ProjectFooterProps) {
  return (
    <footer className="project-footer">
      <div className="project-footer-inner">
        <div className="project-footer-brand">
          <a href={projectHref} className="project-footer-brand-link">
            <span className="project-footer-mark">JR</span>
            <span className="project-footer-brand-text">Projects</span>
          </a>
          <p>
            Applied AI, data platform, and workflow demos<br></br> by Jeffrey
            Ross.
          </p>
        </div>

        <nav
          className="project-footer-nav"
          aria-label="Project footer navigation"
        >
          <div>
            <h3>Portfolio</h3>
            <a href={`${portfolioBaseUrl}/`}>Home</a>
            <a href={`${portfolioBaseUrl}/projects`}>Projects</a>
            <a href={`${portfolioBaseUrl}/blog`}>Blog</a>
          </div>

          <div>
            <h3>About</h3>
            <a href={`${portfolioBaseUrl}/profile`}>Profile</a>
            <a href={`${portfolioBaseUrl}/contact`}>Contact</a>
          </div>

          <div>
            <h3>Social</h3>
            <a
              href="https://www.linkedin.com/in/jeffrey-ross1"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/rossjeffreyvs-dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </nav>
      </div>

      <div className="project-footer-bottom">
        © {new Date().getFullYear()} {projectName}. All rights reserved.
      </div>
    </footer>
  );
}
