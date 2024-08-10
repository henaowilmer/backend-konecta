const { createEmployee, updateEmployee, deleteEmployee, getEmployees } = require('../services/employee/index.js');
const Employee = require('../models/employee.js');

jest.mock('../models/employee.js');

describe('Employee - createEmployee', () => {
    let req, res;
  
    beforeEach(() => {
        req = {
            body: { name: 'Wilmer Henao', date_admission: '2024-07-08', salary: 6000 }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });
  
    it('should create a new employee and return it', async () => {
        const mockEmployee = { id: 1, ...req.body };
        Employee.create.mockResolvedValue(mockEmployee);
    
        await createEmployee(req, res);
    
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockEmployee);
    });
  
    it('should return 400 if there is an error', async () => {
        Employee.create.mockRejectedValue(new Error('Database Error'));
    
        await createEmployee(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database Error' });
    });
});

describe('Employee - updateEmployee', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 1 },
      body: { name: 'Wilmer Henao', date_admission: '2024-07-08', salary: 5000 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should update an employee and return it', async () => {
    const mockEmployee = { id: 1, ...req.body };
    Employee.update.mockResolvedValue([1]);
    Employee.findOne.mockResolvedValue(mockEmployee);

    await updateEmployee(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEmployee);
  });

  it('should return 404 if the employee is not found', async () => {
    Employee.update.mockResolvedValue([0]);

    await updateEmployee(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Registro no encontrado' });
  });

  it('should return 400 if there is an error', async () => {
    Employee.update.mockRejectedValue(new Error('Database Error'));

    await updateEmployee(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Database Error' });
  });
});

describe('Employee - deleteEmployee', () => {
    let req, res;
  
    beforeEach(() => {
        req = {
            params: { id: 1 }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });
  
    it('should delete an employee and return a success message', async () => {
        Employee.destroy.mockResolvedValue(1);
    
        await deleteEmployee(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Registro eliminado exitosamente" });
    });
  
    it('should return 404 if the employee is not found', async () => {
        Employee.destroy.mockResolvedValue(0);
    
        await deleteEmployee(req, res);
    
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Registro no encontrado" });
    });
  
    it('should return 400 if there is an error', async () => {
        Employee.destroy.mockRejectedValue(new Error('Database Error'));
    
        await deleteEmployee(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database Error' });
    });
});
  
describe('Employee - getEmployees', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        query: { page: 1, limit: 10, search: '', date_admission: '' }
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
    });
  
    it('should return a list of employees', async () => {
      const mockEmployees = {
        count: 2,
        rows: [
          { id: 1, name: 'Wilmer Henao', date_admission: '2024-07-08', salary: 6000 },
          { id: 2, name: 'Andres Hernandez', date_admission: '2024-08-08', salary: 7000 }
        ]
      };
      Employee.findAndCountAll.mockResolvedValue(mockEmployees);
  
      await getEmployees(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        totalRecords: mockEmployees.count,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
        data: mockEmployees.rows
      });
    });
  
    it('should return 500 if there is an error', async () => {
      Employee.findAndCountAll.mockRejectedValue(new Error('Database Error'));
  
      await getEmployees(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database Error' });
    });
});
