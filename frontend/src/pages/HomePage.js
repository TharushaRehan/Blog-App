import Box from "@mui/material/Box";
import { TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import LogInIcon from "@mui/icons-material/Login";

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
  boxShadow: "0 3px 5px 2px #47A992",
  color: "#030508",
  fontWeight: "bold",
  height: 48,
  padding: "0 30px",
});
const HomePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentQuote, setCurrentQuote] = useState(0);
  const quotes = [
    "Writing is the painting of the voice. Blogging is the gallery where words come alive.",
    "Words have the power to inspire, inform, and ignite change. Through blogging, we weave stories that connect, educate, and empower the world.",
    "Blogging is the art of sharing thoughts, experiences, and ideas with the world. It's a journey of self-expression that has the potential to create a profound impact on others.",
    "Behind every great blog is a passionate writer who fearlessly pours their heart and soul into every word, leaving a lasting imprint on readers around the globe.",
  ];
  const navigate = useNavigate();

  /*To change the quote after every 5 seconds*/
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((currentQuote) => (currentQuote + 1) % quotes.length);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /*Handle the user login when user click on the login button
  if success navigate to the articles page else display an error */
  const HandleLogIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      navigate("/articles");
    } catch (e) {
      setError("Inavild Email or Password");
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
            width: 750,
            height: 200,
            marginTop: -5,
            fontWeight: "bold",
            paddingLeft: "15px",
            paddingTop: "5px",
            paddingBottom: "10px",
            fontSize: "30px",
            borderRadius: "25px",
            backgroundColor: "#00FFCA",
          }}
        >
          <p>
            " <i>{quotes[currentQuote]}</i>"
          </p>
        </Box>
        <Box
          sx={{
            width: 1000,
            height: 230,
            marginTop: "50px",
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
            <StyledButton
              id="login-btn"
              size="large"
              type="submit"
              endIcon={<LogInIcon />}
              variant="outlined"
            >
              Log In
            </StyledButton>
          </form>
          <p id="checkAcc">Don't have an account ?</p>
          <Link to="/create-account">
            <StyledButton id="signup-btn" size="large" variant="outlined">
              Sign Up
            </StyledButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
