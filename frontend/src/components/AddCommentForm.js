import { useState } from "react";
import axios from "axios";
import { StyledTextField } from "../pages/HomePage";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)({
  background: "linear-gradient(45deg, #fe78fb 40%, #fe17fa 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px #D0F4E5",
  color: "#030508",
  fontWeight: "bold",
  height: 48,
  padding: "0 30px",
});

const AddCommentForm = ({ articleName, onArticleUpdated }) => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const AddComment = async () => {
    if (name.length !== 0 && comment.length !== 0) {
      const response = await axios.post(
        `/api/articles/${articleName}/comments`,
        {
          postedBy: name,
          text: comment,
        }
      );
      const updatedArticle = response.data;
      onArticleUpdated(updatedArticle);
      setName("");
      setComment("");
    }
  };
  return (
    <div className="add-comment-form">
      <div className="name-comment">
        <StyledTextField
          required
          type="text"
          className="textfield"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="text-comment">
        <StyledTextField
          required
          multiline
          rows={4}
          type="text"
          className="textfield"
          label="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div className="add-com-btn">
        <StyledButton size="large" onClick={AddComment}>
          Add Comment
        </StyledButton>
      </div>
    </div>
  );
};

export default AddCommentForm;
