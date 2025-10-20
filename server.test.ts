import {describe, expect, test} from '@jest/globals';
import * as dotenv from "dotenv";

const server = require('./server');
const mongo = require('./mongo');
dotenv.config({path:'./.env'})

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Server',  () => {
  const reqBody = {
    quantity: '1',
    email: 'john@example.com',
    city: 'London',
    street: 'Baker',
    house: '10',
    postCode: '54321',
    phoneNumber: '1234567890',
    productName: 'Widget',
    price: '9.99',
  }
  const headers : {[key:string] : string} = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  test('Validation', () => {
    jest.spyOn(server, 'validateOrderFields')
    expect(server.validateOrderFields(reqBody)).toBe(true)
    expect(server.validateOrderFields).toHaveBeenCalledTimes(1)
  })
  test('POST Order', async () => {
    const response = await fetch(process.env.BASE_URL + '/orders', { method: 'POST', headers: headers, body: JSON.stringify(reqBody)})
    expect(response.status).toEqual(500)
  });
})

describe('Mongo', () => {
  test('find product by id', async () => {
     expect(await mongo.findProductByName("apple_iphone")).toEqual('A23021');
  })  
})
