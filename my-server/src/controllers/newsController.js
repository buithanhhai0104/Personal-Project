const News = require("../models/newsModel");

const newsController = {
  getAllNews: (req, res) => {
    News.getAllNews((err, results) => {
      if (err) {
        console.error("Error fetching news:", err);
        return res.status(500).json({ error: "Failed to fetch news" });
      }
      res.status(200).json(results);
    });
  },

  getNewsById: (req, res) => {
    const { id } = req.params;

    News.getNewsById(id, (err, results) => {
      if (err) {
        console.error("Error fetching news:", err);
        return res.status(500).json({ error: "Failed to fetch news" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "News not found" });
      }

      res.status(200).json(results[0]);
    });
  },

  createNews: async (req, res) => {
    try {
      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      let imageUrl = null;
      if (req.file) {
        imageUrl = req.file.path; // URL từ Cloudinary
      }

      const newsData = { title, content, image: imageUrl };

      // Lưu vào MySQL
      News.createNews(newsData, (err, result) => {
        if (err) {
          console.error("Error creating news:", err);
          return res.status(500).json({ error: "Failed to create news" });
        }

        res.status(201).json({
          success: true,
          message: "News created successfully",
          newsId: result.insertId,
        });
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateNewsById: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content, image } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Nếu có file, upload lên Cloudinary
      let imageUrl = null;
      if (req.file) {
        imageUrl = req.file.path; // URL từ Cloudinary
      }
      const newsData = { title, content, image: imageUrl };

      News.updateNewsById(id, newsData, (err, result) => {
        if (err) {
          console.error("Error updating news:", err);
          return res.status(500).json({ error: "Failed to update news" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "News not found" });
        }

        res.status(200).json({
          success: true,
          message: "News updated successfully",
        });
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  deleteNewsById: (req, res) => {
    const { id } = req.params;

    News.deleteNewsById(id, (err, result) => {
      if (err) {
        console.error("Error deleting news:", err);
        return res.status(500).json({ error: "Failed to delete news" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "News not found" });
      }

      res.status(200).json({ message: "News deleted successfully" });
    });
  },
};

module.exports = newsController;
