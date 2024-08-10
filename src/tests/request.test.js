const { createRequest, updateRequest, deleteRequest, getRequests } = require('../services/request/index.js');
const Request = require('../models/request.js');

jest.mock('../models/request.js');

describe('Request - createRequest', () => {
    let req, res;
  
    beforeEach(() => {
        req = {
            body: { code: 'A1', description: 'Test description', resumen: 'Test resumen', employee_id: 1 }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });
  
    it('should create a new request and return it', async () => {
        const mockRequest = { id: 1, ...req.body };
        Request.create.mockResolvedValue(mockRequest);
    
        await createRequest(req, res);
    
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockRequest);
    });
  
    it('should return 400 if there is an error', async () => {
        Request.create.mockRejectedValue(new Error('Database Error'));
    
        await createRequest(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database Error' });
    });
});

describe('Request - updateRequest', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 1 },
      body: { code: 'A1', description: 'Test description', resumen: 'Test resumen', employee_id: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should update a request and return it', async () => {
    const mockRequest = { id: 1, ...req.body };
    Request.update.mockResolvedValue([1]);
    Request.findOne.mockResolvedValue(mockRequest);

    await updateRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRequest);
  });

  it('should return 404 if the request is not found', async () => {
    Request.update.mockResolvedValue([0]);

    await updateRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Registro no encontrado' });
  });

  it('should return 400 if there is an error', async () => {
    Request.update.mockRejectedValue(new Error('Database Error'));

    await updateRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Database Error' });
  });
});

describe('Request - deleteRequest', () => {
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
  
    it('should delete a request and return a success message', async () => {
        Request.destroy.mockResolvedValue(1);
    
        await deleteRequest(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Registro eliminado exitosamente" });
    });
  
    it('should return 404 if the request is not found', async () => {
        Request.destroy.mockResolvedValue(0);
    
        await deleteRequest(req, res);
    
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Registro no encontrado" });
    });
  
    it('should return 400 if there is an error', async () => {
        Request.destroy.mockRejectedValue(new Error('Database Error'));
    
        await deleteRequest(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database Error' });
    });
});
  
describe('Request - getRequests', () => {
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
  
    it('should return a list of requests', async () => {
      const mockRequests = {
        count: 2,
        rows: [
          { id: 1, code: 'A1', description: 'Test description', resumen: 'Test resumen', employee_id: 1 },
          { id: 2, code: 'A2', description: 'Test description 2', resumen: 'Test resumen 2', employee_id: 2 },
        ]
      };
      Request.findAndCountAll.mockResolvedValue(mockRequests);
  
      await getRequests(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        totalRecords: mockRequests.count,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
        data: mockRequests.rows
      });
    });
  
    it('should return 500 if there is an error', async () => {
      Request.findAndCountAll.mockRejectedValue(new Error('Database Error'));
  
      await getRequests(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database Error' });
    });
});
