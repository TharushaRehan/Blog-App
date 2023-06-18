import ArticleList from "../components/ArticleList";
import articles from "./article-content";
const ArticleListPage = () => {
  return (
    <div className="article-page">
      <h1>Articles</h1>
      <ArticleList articles={articles} />
    </div>
  );
};

export default ArticleListPage;
