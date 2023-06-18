import { Link, useNavigate } from "react-router-dom";
import useUser from "./hooks/useUser";
import { StyledButton } from "./pages/HomePage";
import { getAuth, signOut } from "firebase/auth";
const NavBar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/articles">Articles</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
      <div className="nav-right">
        {user ? (
          <StyledButton
            onClick={() => {
              signOut(getAuth());
            }}
          >
            Log Out
          </StyledButton>
        ) : (
          <StyledButton
            onClick={() => {
              navigate("/");
            }}
          >
            Log In
          </StyledButton>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
