import axios from "axios";
import { useState } from "react";
import { StyledTextField, StyledButton } from "./HomePage";
import useUser from "../hooks/useUser";
import AddIcon from "@mui/icons-material/Add";
const AddArticlePage = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user } = useUser();
  const [msg, setMsg] = useState("");

  /*Run this function after user click on add article button
  get the current user's data and make a post request to the backend with the given article details
  get the recieved msg from the server and display it*/
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
    const data = response.data;
    console.log(data);
    setMsg(data);
    //console.log(msg);
  };
  return (
    <div className="addArticle-container">
      <form onSubmit={handleAddArticle}>
        <p style={{ fontSize: "30px" }}>Add My Article</p>
        <div className="article-name-container">
          <StyledTextField
            required
            label="Article Name"
            className="article-textfield"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="article-title-container">
          <StyledTextField
            required
            label="Article Title"
            type="text"
            className="article-textfield"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="article-content-container">
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
        <p className="add-msg">{msg}</p>

        <StyledButton
          type="submit"
          size="large"
          variant="outlined"
          startIcon={<AddIcon />}
        >
          Add article
        </StyledButton>
      </form>
    </div>
  );
};

export default AddArticlePage;
