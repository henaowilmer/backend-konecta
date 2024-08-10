const express = require('express');
const { authenticateToken, authorizeRole } = require('../../services/auth/index.js');
const { createUser, getUsers, updateUser, deleteUser, getUser } = require('../../services/user/index.js');

const router = express.Router();

router.post("/", authenticateToken, authorizeRole(['admin']), async (req, res, next) => {
  await createUser(req, res);
});

router.put("/:id", authenticateToken, authorizeRole(['admin']), async (req, res, next) => {
  await updateUser(req, res);
});

router.delete("/:id", authenticateToken, authorizeRole(['admin']), async (req, res, next) => {
  await deleteUser(req, res);
});

router.get("/", authenticateToken, authorizeRole(['admin', 'employee']), async (req, res, next) => {
  await getUsers(req, res);
});

router.get("/:id", authenticateToken, authorizeRole(['admin', 'employee']), async (req, res, next) => {
  await getUser(req, res);
});

module.exports = router;
