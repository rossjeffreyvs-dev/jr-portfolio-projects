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
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.brandBlock}>
          <a href={projectHref} style={styles.brandLink}>
            <span style={styles.brandMark}>JR</span>
            <span style={styles.brandText}>Projects</span>
          </a>
          <p style={styles.description}>
            Applied AI, data platform, and workflow demos by Jeffrey Ross.
          </p>
        </div>

        <nav style={styles.nav} aria-label="Project footer navigation">
          <div style={styles.column}>
            <h3 style={styles.heading}>Portfolio</h3>
            <a href={`${portfolioBaseUrl}/`} style={styles.link}>
              Home
            </a>
            <a href={`${portfolioBaseUrl}/projects`} style={styles.link}>
              Projects
            </a>
            <a href={`${portfolioBaseUrl}/blog`} style={styles.link}>
              Blog
            </a>
          </div>

          <div style={styles.column}>
            <h3 style={styles.heading}>About</h3>
            <a href={`${portfolioBaseUrl}/profile`} style={styles.link}>
              Profile
            </a>
            <a href={`${portfolioBaseUrl}/contact`} style={styles.link}>
              Contact
            </a>
          </div>

          <div style={styles.column}>
            <h3 style={styles.heading}>Social</h3>
            <a
              href="https://www.linkedin.com/in/jeffrey-ross1"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/rossjeffreyvs-dev"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              GitHub
            </a>
          </div>
        </nav>
      </div>

      <div style={styles.bottom}>
        © {new Date().getFullYear()} {projectName}. All rights reserved.
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    marginTop: "72px",
    borderTop: "1px solid #e5e7eb",
    background: "#f8fafc",
    color: "#475569",
  },
  inner: {
    width: "min(1180px, calc(100% - 40px))",
    margin: "0 auto",
    padding: "42px 0 28px",
    display: "grid",
    gridTemplateColumns: "minmax(220px, 1.2fr) minmax(280px, 2fr)",
    gap: "32px",
  },
  brandBlock: {
    display: "grid",
    gap: "12px",
    alignContent: "start",
  },
  brandLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    color: "#0f172a",
    textDecoration: "none",
    fontWeight: 800,
  },
  brandMark: {
    display: "inline-flex",
    width: "38px",
    height: "38px",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #0f172a",
    borderRadius: "10px",
    fontSize: "15px",
    lineHeight: 1,
    letterSpacing: "-0.04em",
  },
  brandText: {
    fontSize: "18px",
  },
  description: {
    margin: 0,
    maxWidth: "360px",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  nav: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(120px, 1fr))",
    gap: "24px",
  },
  column: {
    display: "grid",
    gap: "8px",
    alignContent: "start",
  },
  heading: {
    margin: "0 0 4px",
    color: "#0f172a",
    fontSize: "13px",
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  link: {
    color: "#475569",
    fontSize: "14px",
    textDecoration: "none",
  },
  bottom: {
    width: "min(1180px, calc(100% - 40px))",
    margin: "0 auto",
    padding: "18px 0 26px",
    borderTop: "1px solid #e5e7eb",
    color: "#64748b",
    fontSize: "13px",
    textAlign: "center",
  },
};
