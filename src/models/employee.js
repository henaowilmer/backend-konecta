const { Model, DataTypes } = require('sequelize');
const sequelize = require('../pg/index.js');

class Employee extends Model {}

Employee.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    date_admission: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    salary: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
    timestamps: true
});

module.exports = Employee;
