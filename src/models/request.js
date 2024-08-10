const { Model, DataTypes } = require('sequelize');
const sequelize = require('../pg/index.js');
const Employee = require('./employee.js');

class Request extends Model {}

Request.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    resumen: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    employee_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Employee,
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Request',
    tableName: 'requests',
    timestamps: true
});

Request.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

module.exports = Request;
