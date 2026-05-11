type AdminPlaceholderSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
};

const AdminPlaceholderSection = ({
  eyebrow,
  title,
  description,
}: AdminPlaceholderSectionProps) => (
  <section className="admin-card admin-placeholder">
    <div className="admin-card__header">
      <div>
        <span className="admin-card__eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
    </div>
    <p>{description}</p>
  </section>
);

export default AdminPlaceholderSection;
