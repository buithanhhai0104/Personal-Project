const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

router.get(
  "/",
  authController.verifyToken,
  authController.verifyAdmin,
  userController.getUsers
);
router.put(
  "/:id",
  authController.verifyToken,
  authController.verifyAdmin,
  userController.updateUser
);
router.delete(
  "/:id",
  authController.verifyToken,
  authController.verifyAdmin,
  userController.deleteUser
);
router.get(
  "/search",
  authController.verifyToken,
  authController.verifyAdmin,
  authController.verifyToken,
  userController.searchUsers
);
router.get("/:id", userController.getUserById);

module.exports = router;
