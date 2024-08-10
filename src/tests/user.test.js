const { createUser, updateUser, deleteUser, getUsers } = require('../services/user/index.js');
const User = require('../models/user.js');

jest.mock('../models/user.js');

describe('User - createUser', () => {
    let req, res;
  
    beforeEach(() => {
        req = {
            body: { name: 'Wilmer Henao', email: 'wilmer@gmail.com', password: 'wilmer123456', profile_image: '/', role: 'admin' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });
  
    it('should create a new user and return it', async () => {
        const mockUser = { id: 1, ...req.body };
        User.create.mockResolvedValue(mockUser);
    
        await createUser(req, res);
    
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  
    it('should return 400 if there is an error', async () => {
        User.create.mockRejectedValue(new Error('Database Error'));
    
        await createUser(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database Error' });
    });
});

describe('User - updateUser', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 1 },
      body: { name: 'Wilmer Henao', email: 'wilmer@gmail.com', password: 'wilmer123456', profile_image: '/', role: 'admin' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should update an user and return it', async () => {
    const mockUser = { id: 1, ...req.body };
    User.update.mockResolvedValue([1]);
    User.findOne.mockResolvedValue(mockUser);

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it('should return 404 if the user is not found', async () => {
    User.update.mockResolvedValue([0]);

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Registro no encontrado' });
  });

  it('should return 400 if there is an error', async () => {
    User.update.mockRejectedValue(new Error('Database Error'));

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Database Error' });
  });
});

describe('User - deleteUser', () => {
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
  
    it('should delete an user and return a success message', async () => {
        User.destroy.mockResolvedValue(1);
    
        await deleteUser(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Registro eliminado exitosamente" });
    });
  
    it('should return 404 if the user is not found', async () => {
        User.destroy.mockResolvedValue(0);
    
        await deleteUser(req, res);
    
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Registro no encontrado" });
    });
  
    it('should return 400 if there is an error', async () => {
        User.destroy.mockRejectedValue(new Error('Database Error'));
    
        await deleteUser(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database Error' });
    });
});
  
describe('User - getUsers', () => {
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
  
    it('should return a list of users', async () => {
      const mockUsers = {
        count: 2,
        rows: [
          { id: 1, name: 'Wilmer Henao', email: 'wilmer@gmail.com', password: 'wilmer123456', profile_image: '/', role: 'admin' },
          { id: 2, name: 'Test user', email: 'user@gmail.com', password: 'user123456', profile_image: '/', role: 'employee' }
        ]
      };
      User.findAndCountAll.mockResolvedValue(mockUsers);
  
      await getUsers(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        totalRecords: mockUsers.count,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
        data: mockUsers.rows
      });
    });
  
    it('should return 500 if there is an error', async () => {
      User.findAndCountAll.mockRejectedValue(new Error('Database Error'));
  
      await getUsers(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database Error' });
    });
});
