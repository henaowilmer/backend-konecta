const dotenv = require("dotenv");
const Request = require("../../models/request.js");
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

dotenv.config();

const createRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, description, resumen, employee_id } = req.body;
    const request = await Request.create({ code, description, resumen, employee_id });
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { code, description, resumen, employee_id } = req.body;

    const [updated] = await Request.update(
      { code, description, resumen, employee_id },
      { where: { id } }
    );

    if (updated) {
      const updatedRequest = await Request.findOne({ where: { id } });
      res.status(200).json(updatedRequest);
    } else {
      res.status(404).json({ error: "Registro no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Request.destroy({ where: { id } });

    if (deleted) {
      res.status(200).json({ message: "Registro eliminado exitosamente" });
    } else {
      res.status(404).json({ error: "Registro no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", employee_id, start_date, end_date } = req.query;

    const offset = (page - 1) * limit;

    const whereConditions = {};

    if (search) {
      whereConditions[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if(employee_id){
      whereConditions.employee_id = {
        [Op.eq]: employee_id
      };
    }

    if (start_date || end_date) {
      whereConditions.createdAt = {};
    
      if (start_date) {
        whereConditions.createdAt[Op.gt] = new Date(start_date);
      }
    
      if (end_date) {
        end_date.replace('T00:00:000Z','T23:59:59Z');
        whereConditions.createdAt[Op.lte] = new Date(end_date);
      }
    }

    const { count, rows } = await Request.findAndCountAll({
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

const getRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findOne({
      where: { id: id }
    });
    res.status(200).json({
      data: request
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRequest,
  updateRequest,
  deleteRequest,
  getRequests,
  getRequest
};
