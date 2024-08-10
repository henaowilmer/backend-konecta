const express = require('express');
const { authenticateToken, authorizeRole } = require('../../services/auth/index.js');
const { createEmployee, getEmployees, getEmployee, updateEmployee, deleteEmployee, optionsEmployees } = require('../../services/employee/index.js');

const router = express.Router();

router.post("/", authenticateToken, authorizeRole(['admin']), async (req, res, next) => {
  await createEmployee(req, res);
});

router.put("/:id", authenticateToken, authorizeRole(['admin']), async (req, res, next) => {
  await updateEmployee(req, res);
});

router.delete("/:id", authenticateToken, authorizeRole(['admin']), async (req, res, next) => {
  await deleteEmployee(req, res);
});

router.get("/", authenticateToken, authorizeRole(['admin', 'employee']), async (req, res, next) => {
  await getEmployees(req, res);
});

router.get("/options", authenticateToken, authorizeRole(['admin', 'employee']), async (req, res, next) => {
  await optionsEmployees(req, res);
});

router.get("/:id", authenticateToken, authorizeRole(['admin', 'employee']), async (req, res, next) => {
  await getEmployee(req, res);
});

module.exports = router;
