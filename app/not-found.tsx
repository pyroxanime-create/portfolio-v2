import { Link } from "next-view-transitions";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <div className="shell">
      <Header />
      <main id="main" className="main" tabIndex={-1}>
        <section className="tile pad" style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", minHeight: "60vh", justifyContent: "center" }}>
          <h1 className="display h-xl">Not found</h1>
          <p className="muted" style={{ fontSize: 19 }}>That page doesn’t exist. The work is all on the home page.</p>
          <Link href="/" className="btn btn--solid">Back to the home page</Link>
        </section>
      </main>
    </div>
  );
}
