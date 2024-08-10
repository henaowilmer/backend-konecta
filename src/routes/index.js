const userRoutes = require('./users/index.js');
const employeeRoutes = require('./employee/index.js');
const requestRoutes = require('./request/index.js');
const authRoutes = require('./auth/index.js');

module.exports = { userRoutes, employeeRoutes, authRoutes, requestRoutes };
