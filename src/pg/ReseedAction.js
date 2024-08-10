const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const Employee = require('../models/employee.js');
const Request = require('../models/request.js');
const sequelize = require('./index.js');

const ReseedAction = () => {
  async function clear() {
    await sequelize.authenticate();
    await User.destroy({ where: {} });
    console.log("DB cleared");
  }

  async function seedDB() {
    await clear();
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash("secret", salt);

    const user = {
      name: "Admin",
      email: "admin@jsonapi.com",
      password: hashPassword,
      created_at: new Date(),
      profile_image: "../../images/admin.jpg",
    };

    await User.create(user);

    console.log("DB seeded");
  }

  seedDB();
};

module.exports = ReseedAction;
