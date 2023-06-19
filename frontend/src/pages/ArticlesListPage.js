import ArticleList from "../components/ArticleList";
import articles from "./article-content";
import useUser from "../hooks/useUser";
import { StyledButton } from "./HomePage";
import { Link } from "react-router-dom";

const ArticleListPage = () => {
  const { user } = useUser();
  return (
    <div className="article-page">
      <h1>Articles</h1>
      <ArticleList articles={articles} />
      <br />
      <br />
      {user ? (
        <Link to="/addarticles">
          <StyledButton>Add Article</StyledButton>
        </Link>
      ) : (
        <Link to="/">
          <StyledButton>Log in to add an article</StyledButton>
        </Link>
      )}
    </div>
  );
};

export default ArticleListPage;
