import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import FavIcon from "@mui/icons-material/Favorite";
import LogInIcon from "@mui/icons-material/Login";
import axios from "axios";
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";
import CommentsList from "../components/CommentsList";
import useUser from "../hooks/useUser";
import AddCommentForm from "../components/AddCommentForm";

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
const ArticlePage = () => {
  const [articleInfo, setArticleInfor] = useState({ upvotes: 0, comments: [] });
  const params = useParams();
  const articleId = params.articleId;
  const { user, isLoading } = useUser();

  useEffect(() => {
    const loadArticleInfo = async () => {
      const response = await axios.get(`/api/articles/${articleId}`);
      const newArticleInfo = response.data;
      setArticleInfor(newArticleInfo);
    };
    loadArticleInfo();
  }, []);

  const article = articles.find((article) => article.name === articleId);

  const addVote = async () => {
    const response = await axios.put(`/api/articles/${articleId}/upvote`);
    const updatedArticle = response.data;
    setArticleInfor(updatedArticle);
  };

  if (!article) {
    return <NotFoundPage />;
  }
  return (
    <div className="show-article">
      <h1>{article.title}</h1>
      <p id="show-upvote">This article has {articleInfo.upvotes} like(s)</p>
      {article.content.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      {user ? (
        <>
          <StyledButton
            variant="outlined"
            startIcon={<FavIcon />}
            size="large"
            onClick={addVote}
          >
            Like
          </StyledButton>
          <AddCommentForm
            articleName={articleId}
            onArticleUpdated={(updatedArticle) =>
              setArticleInfor(updatedArticle)
            }
          />
        </>
      ) : (
        <Link to="/">
          <StyledButton
            variant="outlined"
            size="medium"
            startIcon={<LogInIcon />}
          >
            Log In to Like and comment
          </StyledButton>
        </Link>
      )}
      {/* <br />
      <br />
      {user ? (
        <AddCommentForm
          articleName={articleId}
          onArticleUpdated={(updatedArticle) => setArticleInfor(updatedArticle)}
        />
      ) : (
        <StyledButton
          variant="outlined"
          startIcon={<LogInIcon />}
          size="medium"
        >
          Log In to add a comment
        </StyledButton>
      )} */}
      <CommentsList comments={articleInfo.comments} />
    </div>
  );
};

export default ArticlePage;
