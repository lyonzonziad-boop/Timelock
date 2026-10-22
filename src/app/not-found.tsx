import Link from "next/link";

export default function NotFound() {
  return (
    <main className="cp-center">
      <div className="cp-glass cp-notfound">
        <h1 className="cp-h1">Page introuvable</h1>
        <p className="cp-muted">Cette page n'existe pas.</p>
        <Link href="/" className="cp-btn cp-btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
