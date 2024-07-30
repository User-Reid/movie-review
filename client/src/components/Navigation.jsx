import { Link, useLocation } from "react-router-dom";
import Auth from '../utils/auth';

export default function Navigation() {
  const { pathname } = useLocation();

  return (
    <nav>
      <Link to="/" className={pathname === "/" ? "underline" : ""}>
        Home
      </Link>
      <Link to="/rated" className={pathname === "/rated" ? "underline" : ""}>
        Rated
      </Link>
      <Link
        to="/favorites"
        className={pathname === "/favorites" ? "underline" : ""}
      >
        Favorites
      </Link>
      <Link onClick={Auth.logout}>Logout</Link>
    </nav>
  );
}
