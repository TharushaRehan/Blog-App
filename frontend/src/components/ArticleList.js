import { Link } from "react-router-dom";
const ArticleList = ({ articles }) => {
  return (
    <>
      {articles.map((article) => (
        <Link
          key={article.name}
          className="article-item"
          to={"/articles/" + article.name}
        >
          <div className="article-item-container">
            <h3>{article.title}</h3>
            <p>{article.content[0].substring(0, 250)}.....</p>
          </div>
        </Link>
      ))}
    </>
  );
};
export default ArticleList;
