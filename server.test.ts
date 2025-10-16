const mongo = require('./mongo');

const mockRedisClient = {
  connect: jest.fn().mockResolvedValue(undefined),
  set: jest.fn().mockResolvedValue('OK'),
};


const routes: {
  get: Map<string, any>;
  post: Map<string, any>;
  delete: Map<string, any>;
} = {
  get: new Map(),
  post: new Map(),
  delete: new Map(),
};


jest.mock('redis', () => {
  return {
    createClient: () => mockRedisClient,
  };
});


const createUserMock = jest.fn().mockResolvedValue('client-123');
const findProductByNameMock = jest.fn().mockResolvedValue('product-456');
jest.mock('./mongo', () => {
  return {
    createUser: createUserMock,
    findProductByName: findProductByNameMock,
  };
});


jest.mock('express', () => {
  return () => ({
    use: jest.fn(),
    get: (path: string, handler: any) => routes.get.set(path, handler),
    post: (path: string, handler: any) => routes.post.set(path, handler),
    delete: (path: string, handler: any) => routes.delete.set(path, handler),
    listen: (port: any, cb?: any) => {
      if (cb) cb();
      return { close: jest.fn() };
    },
  });
});


require('./server');

describe('POST /orders (orderFields validation + flow)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates order when all fields are valid', async () => {
    const handler = routes.post.get('/orders');
    expect(handler).toBeDefined();

    // valid body according to validateOrderFields rules in server.ts
    const req = {
      body: {
        quantity: '2',
        firstName: 'John',
        secondName: 'Doe',
        email: 'john@example.com',
        city: 'London',
        street: 'Baker',
        house: '221',       // numeric-only per validation
        postCode: '12345',  // numeric-only per validation
        phoneNumber: '1234567890',
        productName: 'Widget',
        price: '19.99',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    await handler(req, res);

    // response expectations
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalled();

    const sendArg = (res.send as jest.Mock).mock.calls[0][0];
    expect(sendArg).toHaveProperty('success', true);
    expect(sendArg).toHaveProperty('order');
    expect(sendArg.order).toHaveProperty('customerId', 'client-123');
    expect(Array.isArray(sendArg.order.items)).toBe(true);
    expect(sendArg.order.items.length).toBeGreaterThan(0);

    // verify createUser and findProductByName were invoked
    expect(mongo.createUser).toHaveBeenCalled();
    expect(mongo.findProductByName).toHaveBeenCalledWith('Widget');

    // verify redis.set was called with expected key and payload
    expect(mockRedisClient.set).toHaveBeenCalled();
    const [keyArg, valueArg] = (mockRedisClient.set as jest.Mock).mock.calls[0];
    expect(keyArg).toBe(`productId:product-456`);
    const parsed = JSON.parse(valueArg);
    expect(parsed).toHaveProperty('customerId', 'client-123');
  });

  test('returns 500 when required name field is missing', async () => {
    const handler = routes.post.get('/orders');
    expect(handler).toBeDefined();

    const req = {
      body: {
        quantity: '1',
        // firstName missing -> should fail letters validation
        secondName: 'Doe',
        email: 'john@example.com',
        city: 'London',
        street: 'Baker',
        house: '10',
        postCode: '54321',
        phoneNumber: '1234567890',
        productName: 'Widget',
        price: '9.99',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalled();
    const sendArg = (res.send as jest.Mock).mock.calls[0][0];
    expect(sendArg).toHaveProperty('success', false);
    expect(sendArg).toHaveProperty('error');
  });

  test('returns 500 when numeric-only fields contain letters (house invalid)', async () => {
    const handler = routes.post.get('/orders');
    expect(handler).toBeDefined();

    const req = {
      body: {
        quantity: '3',
        firstName: 'Alice',
        secondName: 'Smith',
        email: 'alice@example.com',
        city: 'Paris',
        street: 'Rivoli',
        house: '12B', // invalid: contains letter, fails numbers regex
        postCode: '75001',
        phoneNumber: '0987654321',
        productName: 'Gadget',
        price: '29.99',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalled();
    const sendArg = (res.send as jest.Mock).mock.calls[0][0];
    expect(sendArg).toHaveProperty('success', false);
  });
});
