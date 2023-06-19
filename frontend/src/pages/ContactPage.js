import { styled } from "@mui/material/styles";
import { TextField, Button } from "@mui/material";
import { useState } from "react";

const StyledTextField = styled(TextField)`
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

const StyledButton = styled(Button)({
  background: "linear-gradient(45deg, #81F5C5 40%, #00FFCA 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 5px 5px 3px #47A992",
  color: "#030508",
  fontWeight: "bold",
  height: 48,
  padding: "0 30px",
});

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify({ name, email, mobile, message }, null, 2));
  };
  return (
    <div className="contact-container">
      <form onSubmit={handleSubmit}>
        <p style={{ fontSize: "30px" }}>Contact Us</p>
        <div className="con-name-textfield">
          <StyledTextField
            required
            label="Name"
            className="textfield"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="con-email-container">
          <StyledTextField
            required
            label="Email"
            type="email"
            className="textfield"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mob-container">
          <StyledTextField
            required
            label="Mobile Number"
            className="textfield"
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>
        <div className="message-container">
          <StyledTextField
            required
            multiline
            rows={4}
            type="text"
            label="Message"
            className="textfield"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="con-btn">
          <StyledButton type="submit" size="large">
            Submit
          </StyledButton>
        </div>
      </form>
    </div>
  );
};

export default ContactPage;
