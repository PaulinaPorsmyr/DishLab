import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mainContainer">
      <section className="page-content">
        <h1>Sidan hittades inte</h1>
        <p>Sidan du letar efter finns inte eller har flyttats.</p>
        <Link className="page-link" to="/">Tillbaka till startsidan</Link>
      </section>
    </div>
  );
}