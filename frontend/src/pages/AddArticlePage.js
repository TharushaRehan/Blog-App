import axios from "axios";
import { useState } from "react";
import { StyledTextField, StyledButton } from "./HomePage";
import useUser from "../hooks/useUser";

const AddArticlePage = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user } = useUser();
  const [msg, setMsg] = useState("");

  const handleAddArticle = async (e) => {
    e.preventDefault();
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};
    const response = await axios.post(
      `/api/articles/addarticle`,
      {
        name,
        title,
        content,
      },
      { headers }
    );
    const msg = response.data;
    console.log(msg);
  };
  return (
    <div className="contact-container">
      <form onSubmit={handleAddArticle}>
        <p style={{ fontSize: "30px" }}>Add My Article</p>
        <div className="con-name-textfield">
          <StyledTextField
            required
            label="Article Name"
            className="article-textfield"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="con-email-container">
          <StyledTextField
            required
            label="Article Title"
            type="text"
            className="article-textfield"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="message-container">
          <StyledTextField
            required
            multiline
            rows={10}
            type="text"
            label="Article Content"
            className="article-textfield"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="article-btn">
          <StyledButton type="submit" size="large">
            Add article
          </StyledButton>
        </div>
      </form>
    </div>
  );
};

export default AddArticlePage;
