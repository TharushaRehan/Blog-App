import { Link } from "react-router-dom";
const ArticleList = ({ articles }) => {
  return (
    <>
      {articles.map((article) => (
        <Link key={article.name} to={"/articles/" + article.name}>
          <div className="article-container">
            <h3>{article.title}</h3>
            <p>{article.content[0].substring(0, 200)}.....</p>
          </div>
        </Link>
      ))}
    </>
  );
};
export default ArticleList;
