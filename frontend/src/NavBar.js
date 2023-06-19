import { Link, useNavigate } from "react-router-dom";
import useUser from "./hooks/useUser";
import { getAuth, signOut } from "firebase/auth";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledButton = styled(Button)({
  background: "linear-gradient(45deg, #81F5C5 40%, #00FFCA 90%)",
  border: 0,
  borderRadius: 3,
  color: "#030508",
  fontWeight: "bold",
  height: 48,
  padding: "0 30px",
});

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
