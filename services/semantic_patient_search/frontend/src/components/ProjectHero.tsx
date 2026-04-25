type ProjectHeroProps = {
  title: string;
  description: string;
};

export default function ProjectHero({ title, description }: ProjectHeroProps) {
  return (
    <section className="projectHero">
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}
