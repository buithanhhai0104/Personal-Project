const express = require("express");
const router = express.Router();
const ticketsController = require("../controllers/ticketsController");
const authController = require("../controllers/authController");
router.post("/book-ticket", ticketsController.bookTicket);
router.get("/:ticket_id", ticketsController.getTicketByTicketId);
router.put("/status", ticketsController.updateMultipleTicketStatus);
router.get("/", ticketsController.getAllTickets);

// Xóa vé theo ID
router.delete("/:ticket_id", ticketsController.deleteTicketById);
module.exports = router;
