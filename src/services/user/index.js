const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('../../models/user.js');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

dotenv.config();

const createUser = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, profile_image, role } = req.body;

    let foundUser = await User.findOne({ where: { email: email } });
    if (foundUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name:name , email:email , password:hashPassword , profile_image:profile_image , role:role });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { name, email, password, profile_image, role } = req.body;

    let foundUser = await User.findOne({ 
      where: { 
        email: email,
        id: { [Op.ne]: id } 
      } 
    });
    if (foundUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const [updated] = await User.update(
      { name:name , email:email , password:hashPassword , profile_image:profile_image , role:role },
      { where: { id: id } }
    );

    if (updated) {
      const updatedUser = await User.findOne({ where: { id: id } });
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: "Registro no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await User.destroy({ where: { id: id } });

    if (deleted) {
      res.status(200).json({ message: "Registro eliminado exitosamente" });
    } else {
      res.status(404).json({ error: "Registro no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", start_date, end_date } = req.query;

    const offset = (page - 1) * limit;

    const whereConditions = {};

    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { role: { [Op.iLike]: `%${search}%` } },
      ];
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

    const { count, rows } = await User.findAndCountAll({
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

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id: id }
    });
    res.status(200).json({
      data: user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUser
};
