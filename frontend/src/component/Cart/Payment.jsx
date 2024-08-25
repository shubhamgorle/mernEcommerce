import React, { Fragment, useEffect, useRef } from 'react';
import CheckoutStep from './CheckoutStep';
import { useSelector, useDispatch } from "react-redux";
import {useNavigate} from "react-router-dom"
import Metadata from '../layout/Metadata';
import { Typography } from '@mui/material';
import { useAlert } from 'react-alert';
import { CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements } from "@stripe/react-stripe-js"
import axios from 'axios';
import "./Payment.css"
import CreditCardIcon from "@material-ui/icons/CreditCard"
import EventIcon from "@material-ui/icons/Event"
import VpnKeyIcon from "@material-ui/icons/VpnKey"
import { clearErrors, createOrder} from '../../actions/orderAction';

const Payment = () => {

   const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
   const dispatch = useDispatch();
   const navigate = useNavigate()
   const alert = useAlert();
   const stripe = useStripe();
   const elements = useElements();
   const payBtn = useRef(null);

   const { shippingInfo, cartItems } = useSelector((state => state.cart));
   const { user } = useSelector((state => state.user));
   const {  error } = useSelector((state => state.newOrder));
   const paymentData = {
      amount:Math.round(orderInfo.totalPrice * 100)
    }
 
    const order = {
      shippingInfo,
      orderItems:cartItems,
      itemsPrice:orderInfo.subtotal,
      taxPrice:orderInfo.tax,
      shippingPrice:orderInfo.shippingCharges,
      totalPrice:orderInfo.totalPrice
    }

   const submitHandler = async (e) => {
      e.preventDefault();
      payBtn.current.disabled = true;
      try {
         const config = {
            headers: { "Content-Type": "application/json" }
         }
         const { data } = await axios.post("/api/v1/payment/process", paymentData, config);
         const client_secret = data.client_secret;
         if (!stripe || !elements) return;

         const result = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
               card: elements.getElement(CardNumberElement),
               billing_details: {
                  name: user.name,
                  email: user.email,
                  address: {
                     line1: shippingInfo.address,
                     city: shippingInfo.city,
                     state: shippingInfo.state,
                     postal_code: shippingInfo.pinCode,
                     country: shippingInfo.country
                  }
               }
            }
         })
         if (result.error) {
            payBtn.current.disabled = false;
            alert.error(result.error.message)
         }
         else{
            if(result.paymentIntent.status === "succeeded"){
               order.paymentInfo = {
                  id:result.paymentIntent.id,
                  status:result.paymentIntent.status
               }
               dispatch(createOrder(order))
               navigate("/success")
            }
            else{
               alert.error("Therre's some issue while processing payment")
            }
         }
      } 
      
      catch (error) {
         payBtn.current.disabled = false;
         alert.error(error.response.data.message)
      }
   }

   useEffect(()=>{
       if(error){
         alert.error(error);
         dispatch(clearErrors())
       }

   },[dispatch, error, alert])


   return (
      <Fragment>
         <Metadata title="Payment" />
         <CheckoutStep activeStep={2} />
         <div className="paymentContainer">
            <form action="" className="paymentForm"
               onSubmit={(e) => submitHandler(e)}
            >
               <Typography>Card Info</Typography>
               <div>
                  <CreditCardIcon />
                  <CardNumberElement className='paymentInput' />
               </div>
               <div>
                  <EventIcon />
                  <CardExpiryElement className='paymentInput' />
               </div>
               <div>
                  <VpnKeyIcon />
                  <CardCvcElement className='paymentInput' />
               </div>
               <button className='paymentFormBtn' ref={payBtn} type='submit'>Pay &#x20B9;{orderInfo && orderInfo.totalPrice}</button>
            </form>
         </div>
      </Fragment>
   )
}

export default Payment
