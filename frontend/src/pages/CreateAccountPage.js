import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { StyledTextField } from "./HomePage";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export const StyledButton = styled(Button)({
  background: "linear-gradient(45deg, #81F5C5 40%, #00FFCA 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px #47A992",
  color: "#030508",
  fontSize: "20px",
  width: 250,
  height: 48,
  padding: "0 30px",
  textTransform: "capitalize",
});

const CreateAccountPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const HandleCreateAcc = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      if (password.length <= 5) {
        setError("Password must have atleast 6 characters.");
        setPassword("");
        setConfirmPassword("");
      } else {
        try {
          await createUserWithEmailAndPassword(getAuth(), email, password);
          navigate("/articles");
        } catch (e) {
          if (e.message === "Firebase: Error (auth/email-already-in-use).")
            setError("Already have an account");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        }
      }
    } else {
      setError("Password do not match.");
      setPassword("");
      setConfirmPassword("");
      return;
    }
  };
  return (
    <div className="signup-form">
      <form onSubmit={HandleCreateAcc}>
        <p style={{ fontSize: "30px", textAlign: "center" }}>Create Account</p>
        <div className="signup-email">
          <StyledTextField
            required
            type="email"
            className="textfield"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="signup-password">
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
        <div className="signup-conf-password">
          <StyledTextField
            required
            type="password"
            className="textfield"
            label="Confirm Password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ paddingTop: "20px", color: "red" }}>{error}</p>}
        <div className="signup-btn">
          <StyledButton size="large" type="submit">
            Create Account
          </StyledButton>
        </div>
        <Link to="/">
          <p style={{ textDecoration: "none", color: "black" }}>
            Already have an account ? Log In here.
          </p>
        </Link>
      </form>
    </div>
  );
};

export default CreateAccountPage;
