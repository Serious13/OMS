import { Request, Response } from 'express';
import { findProductByName, createUser } from "./mongo"
import * as dotenv from "dotenv";

dotenv.config({path:'./.env'})

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const redis = require('redis');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const redisClient = redis.createClient(); 

redisClient.connect().catch(console.error);

/* fetches order by id */
app.get('/order/:id', async (req: Request, res: Response) => {
 
})

/* validates order and send true if all fields are validated */
function validateOrderFields(order : object) : boolean {
  let validated : boolean = true
  const numbers = /^(\d+\s?)+$/ //validates digits
  const letters = /^[A-Za-z]+$/ //validates letters
  for (let [key,value] of Object.entries(order)) {
      if (key === "quantity" || key === "house" || key === "postCode") {
          if ((!value || !(parseInt(value) > -1) || !numbers.test(value))) {           
            validated = false 
          }
      }
      else {
        if (!(["email", "phoneNumber", "price", "productName"].includes(key))) { //not checking four following fields
          if ((!value || !(letters.test(value)))) {           
              validated = false 
          }          
        }
      }
  }
  console.log("validated", validated)
  return validated
}
/* creates and send JSON back to frontend e-shop */
app.post('/orders', async (req: Request, res: Response) => {
  try {
    console.log("req body", req.body)
    let body : object =  req.body
    let orderFields : {[key:string] : string | any} = {}
    let clientId : string = ""
    let productId : string = ""
    let productIems : Array<object> = []
    let order : {[key:string] : string | any} = {}

    if (body) {
      orderFields = {
        quantity : req.body.quantity,
        firstName : req.body.firstName,
        secondName : req.body.secondName,
        email : req.body.email,
        city : req.body.city,
        street : req.body.street,
        house : req.body.house,
        postCode : req.body.postCode,
        phoneNumber: req.body.phoneNumber,
        productName: req.body.productName,
        price: req.body.price
      }
      console.log("val", validateOrderFields(orderFields))
    }
    if (validateOrderFields(orderFields)) {
      clientId = await createUser(
        {
          "name" : orderFields?.firstName,
          "surname" : orderFields.secondName, 
          "email" : orderFields.email,
          "city" : orderFields.city,
          "street" : orderFields.street,
          "house" : orderFields.house,
          "postCode" : req.body.postCode,
          "phoneNumber" : req.body.phoneNumber
        }
      )
      productId = await findProductByName(orderFields.productName)
      productIems.push(
        {
          productId : productId, 
          quantity : orderFields.quantity, 
          price : orderFields.price, 
          shippingAddress : `${orderFields.city} ${orderFields.street} ${orderFields.house} ${req.body.postCode}`
        }
      )
      order = {
          customerId : clientId,
          items : productIems
      }
      console.log("client_id", clientId, productId, productIems, order)
      if ((order.customerId !== "") && (order.items.length > 0)) {
          await redisClient.set(`productId:${productId}`, JSON.stringify(order));
          res.status(200).send({success: true, order : order})
      }
    }
    else res.status(500).send({success: false, error: {message: 'Order can not be created'}})
  }
  catch(e) {
    return e
  }
});

/* delete order by id */
app.delete('/order/:id', async (req : Request, res : Response) => {

})

app.listen(String(process.env.port), async () => {
  console.log(`Server running on ${String(process.env.port)}`);
});
