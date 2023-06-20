import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import FavIcon from "@mui/icons-material/Favorite";
import LogInIcon from "@mui/icons-material/Login";
import axios from "axios";
import NotFoundPage from "./NotFoundPage";
import CommentsList from "../components/CommentsList";
import useUser from "../hooks/useUser";
import AddCommentForm from "../components/AddCommentForm";

const StyledButton = styled(Button)({
  background: "linear-gradient(45deg, #81F5C5 40%, #00FFCA 90%)",
  variant: "outlined",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px #47A992",
  color: "#030508",
  fontWeight: "bold",
  textTransform: "capitalize",
  height: 48,
  padding: "0 30px",
});
const ArticlePage = () => {
  const [articleInfo, setArticleInfor] = useState({
    upvotes: 0,
    comments: [],
    canUpvote: false,
  });
  const { canUpvote } = articleInfo;
  const { articleId } = useParams();
  const { user, isLoading } = useUser();
  const [statusCode, setStatusCode] = useState(null);

  /*Run this every time the values of user,isloading,upvotes changes*/
  useEffect(() => {
    const loadArticleInfo = async () => {
      const token = user && (await user.getIdToken());
      const headers = token ? { authtoken: token } : {};
      try {
        const response = await axios.get(`/api/articles/${articleId}`, {
          headers: headers,
        });
        const newArticleInfo = response.data;
        setArticleInfor(newArticleInfo);
      } catch (error) {
        if (error.response.status === 404) {
          setStatusCode(404);
          return;
        }
      }
    };

    if (!isLoading) {
      loadArticleInfo();
    }
  }, [isLoading, user, articleInfo.upvotes]);

  /*If user go to invalid article page display the not found page */
  if (statusCode === 404) {
    return <NotFoundPage />;
  }
  /*function to add likes to a article */
  const addVote = async () => {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};
    const response = await axios.put(
      `/api/articles/${articleId}/upvote`,
      null,
      { headers }
    );
    const updatedArticle = response.data;
    setArticleInfor(updatedArticle);
  };

  /*Add new lines if we found '\n' in the article content */
  const addLineBreaks = (content) => {
    if (!content) {
      return [];
    }
    return content.split("\n");
  };

  return (
    <div className="show-article">
      <h1>{articleInfo.title}</h1>
      <p id="show-upvote">This article has {articleInfo.upvotes} like(s)</p>
      {addLineBreaks(articleInfo.content).map((line, index) => (
        <p key={index}>{line}</p>
      ))}
      {user ? (
        <>
          <StyledButton
            variant="outlined"
            startIcon={<FavIcon />}
            size="large"
            onClick={addVote}
          >
            {canUpvote ? "Already Liked" : " Like"}
          </StyledButton>
        </>
      ) : (
        <Link to="/">
          <StyledButton
            variant="outlined"
            size="medium"
            startIcon={<LogInIcon />}
          >
            Log In to Like
          </StyledButton>
        </Link>
      )}
      <br />
      <br />
      {user ? (
        <AddCommentForm
          articleName={articleId}
          onArticleUpdated={(updatedArticle) => setArticleInfor(updatedArticle)}
        />
      ) : (
        <Link to="/">
          <StyledButton
            variant="outlined"
            startIcon={<LogInIcon />}
            size="medium"
          >
            Log In to add a comment
          </StyledButton>
        </Link>
      )}
      <CommentsList comments={articleInfo.comments} />
    </div>
  );
};

export default ArticlePage;
