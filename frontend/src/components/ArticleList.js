import { Link } from "react-router-dom";
const ArticleList = ({ articles }) => {
  const getBriefDescr = (content) => {
    if (content.length <= 250) {
      return content;
    } else {
      return content.substring(0, 250) + "...";
    }
  };
  return (
    <>
      {articles.length > 0 ? (
        articles.map((article) => (
          <Link
            key={article._id}
            className="article-item"
            to={"/articles/" + article.name}
          >
            <div className="article-item-container">
              <h3>{article.title}</h3>
              <p>{getBriefDescr(article.content)}</p>
            </div>
          </Link>
        ))
      ) : (
        <p>No articles found.</p>
      )}
    </>
  );
};
export default ArticleList;
