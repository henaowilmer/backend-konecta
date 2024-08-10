const User = require("../models/user.js");
const Employee = require('../models/employee.js');
const Request = require('../models/request.js');
const sequelize = require("./index.js");

async function clear() {
  await sequelize.authenticate();
  await User.destroy({ where: {} });
  await Employee.destroy({ where: {} });
  await Request.destroy({ where: {} });
  
  console.log("DB cleared");
}

clear().then(() => {
  sequelize.close();
});
