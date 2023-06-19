import { StyledTextField, StyledButton } from "./HomePage";

const AddArticlePage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    //alert(JSON.stringify({ name, email, mobile, message }, null, 2));
  };
  return (
    <div className="contact-container">
      <form onSubmit={handleSubmit}>
        <p style={{ fontSize: "30px" }}>Add My Article</p>
        <div className="con-name-textfield">
          <StyledTextField
            required
            label="Name"
            className="textfield"
            type="text"
            // value={name}
            // onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="con-email-container">
          <StyledTextField
            required
            label="Email"
            type="email"
            className="textfield"
            // value={email}
            // onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mob-container">
          <StyledTextField
            required
            label="Mobile Number"
            className="textfield"
            type="text"
            // value={mobile}
            // onChange={(e) => setMobile(e.target.value)}
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
            // value={message}
            // onChange={(e) => setMessage(e.target.value)}
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

export default AddArticlePage;
