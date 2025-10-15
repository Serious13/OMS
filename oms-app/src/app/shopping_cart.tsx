'use client'

import Form from 'next/form'
import { FormEvent } from 'react'
import Image from 'next/image'
 

export default function Page() {
  let baseUrl : string = `${String(process.env.NEXT_PUBLIC_BASE_URL)}`
  let orderUrl: string = baseUrl + "/order/:id"

  async function onSubmit(event: FormEvent<HTMLFormElement>) : Promise<any> {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    console.log("formData", formData, formData.get("quantity"))
    const quantity : string = String(formData.get("quantity"))
    const firstName : string = String(formData.get("first_name"))
    const secondName : string = String(formData.get("second_name"))
    const email : string = String(formData.get("email"))
    const city : string = String(formData.get("city"))
    const streetName : string = String(formData.get("street"))
    const houseNum : string = String(formData.get("building"))
    const postCode : string = String(formData.get("postcode"))
    const phoneNumber : string = String(formData.get("phone_number"))
  
    let formDataValues : object = {
      quantity : quantity,
      firstName : firstName,
      secondName : secondName,
      email : email,
      city : city,
      street : streetName,
      house : houseNum,
      postCode : postCode,
      phoneNumber: phoneNumber,
      productName: "apple_iphone",
      price: "1650€"
    }
  
    const headersApp : {[key:string] : string} = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    
    const response = await fetch('http://localhost:5000/orders', {
      method: 'POST',
      headers: headersApp,
      body: JSON.stringify(formDataValues)
    })
 
    const data = await response.json()
    console.log("res", data)
    return data
  }

  return (
    <> 
      <form onSubmit={onSubmit} method="post">
        <h3>Einkaufswagen</h3>
        <div className = "shopping_cart">
          <div className = "product_bar">          
            <div className = "product_bar_preis">
              <div className = "product_bar_preis_iphone">
                <span>Apple iPhone</span>
                <span className="preis">Preis : 1650€</span>
              </div>
              <Image src = "/iphone.png"  width = {100} height = {100} alt="Apple iPhone 16e Schwarz 128 GB 15.5 cm (6.1 Zoll)"/>
            </div>
            <div className = "quantity_bar">
              <p>Stück</p>
              <label htmlFor = "quantity"></label>
              <input type="text" name="quantity" minLength={1} pattern = "[0-9]+" title="Only digits are allowed" className="input_bar"/>
            </div>
          </div>
          <div className = "client_bar">           
            <div className="client_bar_info">
              <label htmlFor = "first_name">Vorname</label>
              <input type="text" name="first_name" className="first_name" id="first_name" minLength={4} maxLength={8} pattern="^[A-Za-z]+$" title="Only letters are allowed" required />
            </div>
            <div className="client_bar_info">
              <label htmlFor = "second_name">Name</label>
              <input type="text" name="second_name" className="second_name" minLength={4} maxLength={8} pattern="^[A-Za-z]+$" title="Only letters are allowed"  required />
            </div>
            <div className="client_bar_info">
              <label htmlFor = "email">Email</label>
              <input type="email" name="email" className="email" minLength={4} maxLength={20} pattern=".+@gmail\.com" title="Use @ .com" required />
            </div>
            <div className="client_bar_info">
              <label htmlFor = "city">Stadt</label>
              <input type="text" name="city" className="city" minLength={4} maxLength={8} pattern="^[A-Za-z]+$" title="Only letters are allowed"  required/>
            </div>
            <div className="client_bar_info">
              <label htmlFor = "street">Straße</label>
              <input type="text" name="street" className="street" minLength={4} maxLength={18} pattern="^[A-Za-z]+$" title="Only letters are allowed"  required/>
            </div>
            <div className="client_bar_info">
              <label htmlFor = "building">Hausnummer</label>
              <input type="text" name="building" className="building" pattern = "[0-9]+" title="Only digits are allowed" required/>
            </div>
            <div className="client_bar_info">
              <label htmlFor = "postcode">PLZ</label>
              <input type="text" name="postcode" className="postcode" minLength={5}  title="Only digits are allowed" required/>
            </div>
            <div className="client_bar_info">
              <label htmlFor = "phone_number">Telefonnummer</label>
              <input type="tel" name="phone_number" className="phone_number" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" title="3 digits-3 digits-4 digits" required/>
            </div>
          </div>
          <button type="submit" className="button_submit">Kaufen</button>
        </div>
      </form> 
    </>
  )
}

/**
 * <Form action="http://localhost:5000/order/1">
        <input name="query" />
        <input type="text" name="name"></input>
        <button type="submit">Submit</button>
      </Form>
 */

/**
 <form onSubmit={onSubmit} method="post">
         <div className="form-example">
            <label htmlFor ='name'>Enter your name: </label>
            <input type="text" name="name" id="name"  /> 
          </div>
          <div className="form-example">
            <label  htmlFor='email'>Enter your email: </label>
            <input type="email" name="email" id="email" /> 
          </div>
          <div className="form-example">
            <input type="submit" value="Subscribe!" />
        </div>
      </form> 
 
 */

      //16e Schwarz 128 GB 15.5 cm (6.1 Zoll)