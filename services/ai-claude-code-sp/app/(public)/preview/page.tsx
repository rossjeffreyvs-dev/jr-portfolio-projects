// preview page for newly created UI components
import Skeleton from "@/components/Skeleton"
import Avatar from "@/components/Avatar"

export default function PreviewPage() {
  return (
    <div className="page-content">
      <h2>Preview</h2>

      <section style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Skeleton Component</h3>
        <Skeleton />
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Avatar Component</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Avatar name="John Doe" />
          <Avatar name="Alice" />
          <Avatar name="JohnSmith" />
          <Avatar name="BobJohnson" />
        </div>
      </section>
    </div>
  )
}
