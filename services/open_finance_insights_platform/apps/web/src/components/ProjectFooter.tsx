export default function ProjectFooter() {
  return (
    <footer className="project-footer">
      <div className="project-footer-inner">
        <div className="footer-brand">
          <div className="brand-mark small">JR</div>
          <div>
            <strong>Projects</strong>
            <p>Applied AI, data platform, and workflow demos by Jeffrey Ross.</p>
          </div>
        </div>
        <div className="footer-columns">
          <div>
            <span>Portfolio</span>
            <a href="https://www.jeffrey-ross.me/">Home</a>
            <a href="https://www.jeffrey-ross.me/projects">Projects</a>
          </div>
          <div>
            <span>About</span>
            <a href="https://www.jeffrey-ross.me/about">Profile</a>
            <a href="https://www.jeffrey-ross.me/contact">Contact</a>
          </div>
          <div>
            <span>Social</span>
            <a href="https://www.linkedin.com/in/jeffrey-ross/">LinkedIn</a>
            <a href="https://github.com/rossjeffreyvs-dev/jr-portfolio-projects">Code & Architecture</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
