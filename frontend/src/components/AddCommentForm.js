import { useState } from "react";
import axios from "axios";
import { StyledTextField } from "../pages/HomePage";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import useUser from "../hooks/useUser";
import Icon from "@mui/icons-material/Comment";

const StyledButton = styled(Button)({
  background: "linear-gradient(45deg, #81F5C5 40%, #00FFCA 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px #D0F4E5",
  color: "#030508",
  fontWeight: "bold",
  textTransform: "capitalize",
  height: 48,
  padding: "0 30px",
});

const AddCommentForm = ({ articleName, onArticleUpdated }) => {
  const [comment, setComment] = useState("");
  const { user } = useUser();

  const AddComment = async () => {
    if (comment.length !== 0) {
      //setEmail({user.email})
      const token = user && (await user.getIdToken());
      const headers = token ? { authtoken: token } : {};
      const response = await axios.post(
        `/api/articles/${articleName}/comments`,
        {
          text: comment,
        },
        { headers }
      );
      const updatedArticle = response.data;
      onArticleUpdated(updatedArticle);
      setComment("");
    }
  };
  return (
    <div className="add-comment-form">
      {user ? (
        <p
          style={{ paddingLeft: "25px", marginTop: "30px", fontWeight: "bold" }}
        >
          Your are posting as {user.email}
        </p>
      ) : (
        <p></p>
      )}
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
        <StyledButton size="large" onClick={AddComment} startIcon={<Icon />}>
          Add Comment
        </StyledButton>
      </div>
    </div>
  );
};

export default AddCommentForm;
