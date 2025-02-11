const User = require("../models/userModel");

exports.getUsers = (req, res) => {
  User.getAllUsers((err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(result);
  });
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  User.updateUser(id, { name, email, role }, (err) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: "Cập nhật thành công!" });
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  User.deleteUser(id, (err) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json({ message: "Xóa thành công!" });
  });
};

exports.searchUsers = (req, res) => {
  const searchQuery = req.query.q || "";

  User.getUsersBySearch(searchQuery, (err, results) => {
    if (err) {
      return res
        .status(500)
        .send({ error: "Có lỗi xảy ra khi tìm kiếm người dùng." });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .send({ message: "Không tìm thấy người dùng nào." });
    }

    res.json(results);
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  User.getUserById(id, (error, result) => {
    if (error) {
      return res
        .status(500)
        .send({ error: "Lỗi máy chủ khi lấy thông tin người dùng." });
    }
    if (result.length === 0) {
      return res
        .status(404)
        .send({ message: "Không tìm thấy người dùng với ID này." });
    }
    res.json(result[0]);
  });
};
