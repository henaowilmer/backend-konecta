const express = require('express');
const { authenticateToken, authorizeRole } = require('../../services/auth/index.js');
const { createRequest, updateRequest, deleteRequest, getRequests, getRequest } = require('../../services/request/index.js');

const router = express.Router();

router.post("/", authenticateToken, authorizeRole(['admin', 'employee']), async (req, res, next) => {
  await createRequest(req, res);
});

router.put("/:id", authenticateToken, authorizeRole(['admin']), async (req, res, next) => {
  await updateRequest(req, res);
});

router.delete("/:id", authenticateToken, authorizeRole(['admin']), async (req, res, next) => {
  await deleteRequest(req, res);
});

router.get("/", authenticateToken, authorizeRole(['admin', 'employee']), async (req, res, next) => {
  await getRequests(req, res);
});

router.get("/:id", authenticateToken, authorizeRole(['admin', 'employee']), async (req, res, next) => {
  await getRequest(req, res);
});

module.exports = router;
