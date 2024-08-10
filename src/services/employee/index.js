const dotenv = require('dotenv');
const Employee = require('../../models/employee.js');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

dotenv.config();

const createEmployee = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, date_admission, salary } = req.body;
    const employee = await Employee.create({ name: name, date_admission: date_admission, salary: salary });
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, date_admission, salary } = req.body;

    const [updated] = await Employee.update(
      { name: name, date_admission: date_admission, salary: salary },
      { where: { id: id } }
    );

    if (updated) {
      const updatedEmployee = await Employee.findOne({ where: { id: id } });
      res.status(200).json(updatedEmployee);
    } else {
      res.status(404).json({ error: "Registro no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Employee.destroy({ where: { id: id } });

    if (deleted) {
      res.status(200).json({ message: "Registro eliminado exitosamente" });
    } else {
      res.status(404).json({ error: "Registro no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getEmployees = async (req, res) => {
  try {
    
    const { page = 1, limit = 10, search = "", start_date, end_date } = req.query;

    const offset = (page - 1) * limit;

    const whereConditions = {};

    if (search) {
      const searchNumber = parseFloat(search);

      if (!isNaN(searchNumber)) {
        whereConditions.salary = {
          [Op.eq]: searchNumber
        };
      } else {
        whereConditions[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } }
        ];
      }
    }

    if (start_date || end_date) {
      whereConditions.date_admission = {};
    
      if (start_date) {
        whereConditions.date_admission[Op.gt] = new Date(start_date);
      }
    
      if (end_date) {
        end_date.replace('T00:00:000Z','T23:59:59Z');
        whereConditions.date_admission[Op.lte] = new Date(end_date);
      }
    }

    const { count, rows } = await Employee.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['id', 'ASC']]
    });

    res.status(200).json({
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      limit: parseInt(limit, 10),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const optionsEmployees = async (req, res) => {
  try {
    const { rows } = await Employee.findAndCountAll({
      attributes: ['id', 'name'],
      order: [['id', 'ASC']]
    });

    res.status(200).json({
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({
      where: { id: id }
    });
    res.status(200).json({
      data: employee
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployees,
  getEmployee,
  optionsEmployees
};
