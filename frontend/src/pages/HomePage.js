import Box from "@mui/material/Box";
import { TextField, Button } from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    background-color: #ffffff;
  }
  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #088395;
  }
  .MuiInputLabel-root.Mui-focused {
    color: #088395;
  }
`;

export const StyledButton = styled(Button)({
  background: "linear-gradient(45deg, #81F5C5 40%, #00FFCA 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px #D0F4E5",
  color: "#030508",
  fontWeight: "bold",
  height: 48,
  padding: "0 30px",
});
const HomePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const HandleLogIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      navigate("/articles");
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <div className="home-content">
      <div className="body-content">
        <div className="welcome">
          <p>Welcome !</p>
        </div>
        <Box
          sx={{
            width: 550,
            height: 180,
            marginTop: -5,
            fontWeight: "bold",
            paddingLeft: "15px",
            paddingTop: "5px",
            paddingBottom: "10px",
            fontSize: "30px",
            borderRadius: "25px",
            transition: "background-color 0.8s ease",
            "&:hover": {
              background: "#00FFCA",
            },
          }}
        >
          <p>
            "{" "}
            <i>
              Writing is the painting of the voice. Blogging is the gallery
              where words come alive.
            </i>
            "
          </p>
        </Box>
        <Box
          sx={{
            width: 1000,
            height: 230,
            marginTop: "30px",
            padding: "10px",
            fontFamily: "Garamond",
            fontSize: "30px",
            borderRadius: "25px",
            background: "linear-gradient(45deg, #81F5C5 30%, #00FFCA 70%)",
          }}
        >
          <p>
            Within the vast realm of blogging, where creativity intertwines with
            the power of words, a new world emerges. Blogging is a gateway to
            self-expression, a platform where ideas take flight and stories find
            their voice. It is a sanctuary for the wandering minds and
            passionate souls who seek to share their unique perspectives with
            the world.
          </p>
        </Box>
        <div className="login-form">
          <form onSubmit={HandleLogIn}>
            <p style={{ fontSize: "30px", textAlign: "center" }}>Log In</p>
            <div className="email-textfield">
              <StyledTextField
                required
                type="email"
                className="textfield"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="password-textfield">
              <StyledTextField
                required
                type="password"
                className="textfield"
                label="Password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="error">{error}</p>}
            <StyledButton id="login-btn" size="large" type="submit">
              Log In
            </StyledButton>
          </form>
          <p id="checkAcc">Don't have an account ?</p>
          <Link to="/create-account">
            <StyledButton id="signup-btn" size="large">
              Sign Up
            </StyledButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
