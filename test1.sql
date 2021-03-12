\c nc_news_test

--In the following example, we are attempting to generate a COUNT of the films by each director.

--SELECT directors.* FROM directors
--LEFT JOIN films ON films.director_id = directors.director_id;

--comment_count which is the total count of all the comments with this article_id

SELECT articles.* , COUNT(comment_id) AS comment_count FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id;