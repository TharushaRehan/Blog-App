import ArticleList from "../components/ArticleList";
import useUser from "../hooks/useUser";
import { StyledButton } from "./HomePage";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
const ArticleListPage = () => {
  const { user } = useUser();
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const loadArticles = async () => {
      const response = await axios.get(`/api/articles/getall`);
      setArticles(response.data);
    };
    loadArticles();
  }, []);

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
