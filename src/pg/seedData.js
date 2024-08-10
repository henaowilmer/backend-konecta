const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const Employee = require('../models/employee.js');
const Request = require('../models/request.js');
const sequelize = require('./index.js');

async function seedDB() {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash("secret", salt);

  const user = {
    name: "Admin",
    email: "admin@jsonapi.com",
    password: hashPassword,
    created_at: new Date(),
    profile_image: "../../images/admin.jpg",
    role: "admin"
  };

  await User.create(user);

  const userEmployee = {
    name: "Employee",
    email: "employee@jsonapi.com",
    password: hashPassword,
    created_at: new Date(),
    profile_image: "../../images/admin.jpg",
    role: "employee"
  };

  await User.create(userEmployee);

  console.log("DB seeded");
}

seedDB().then(() => {
  sequelize.close();
});
