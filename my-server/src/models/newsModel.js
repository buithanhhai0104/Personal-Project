const db = require("../config/db");

const NewsModel = {
  getAllNews: (callback) => {
    const query = "SELECT * FROM news";
    db.query(query, callback);
  },

  getNewsById: (id, callback) => {
    const query = "SELECT * FROM news WHERE id = ?";
    db.query(query, [id], callback);
  },

  createNews: (newsData, callback) => {
    const query = "INSERT INTO news (title, content, image) VALUES (?, ?, ?)";
    const { title, content, image } = newsData;
    db.query(query, [title, content, image], callback);
  },

  updateNewsById: (id, newsData, callback) => {
    const query =
      "UPDATE news SET title = ?, content = ?, image = ? WHERE id = ?";
    const { title, content, image } = newsData;
    db.query(query, [title, content, image, id], callback);
  },

  deleteNewsById: (id, callback) => {
    const query = "DELETE FROM news WHERE id = ?";
    db.query(query, [id], callback);
  },
};

module.exports = NewsModel;
