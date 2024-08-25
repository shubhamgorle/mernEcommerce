import React, { Fragment } from 'react';
import "./ConfirmOrder.css";
import CheckoutStep from './CheckoutStep';
import { useSelector } from 'react-redux';
import Metadata from '../layout/Metadata';
import { Link } from "react-router-dom";
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const ConfirmOrder = () => {
        const { shippingInfo, cartItems } = useSelector((state) => state.cart);
        const { user } = useSelector((state) => state.user);
        const navigate = useNavigate();
        const subtotal = cartItems.reduce((acc, item)=> acc + item.quantity * item.price, 0);

        const shippingCharges = subtotal > 1000 ? 0 : 200;
        
        const tax = subtotal * 0.18

        const totalPrice = subtotal + shippingCharges + tax;
        const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`
   
         const proceedToPayment = () =>{
            const data = {
                subtotal,
                shippingCharges,
                tax,
                totalPrice
            }
            sessionStorage.setItem("orderInfo", JSON.stringify(data));
            navigate("/process/payment")
         }
   
        return (
        <Fragment>
            <Metadata title="Confirm Order" />
            <CheckoutStep activeStep={1} />
            <div className='confirmOrderPage'>

                <div>
                    <div className="confirmShippingArea">
                        <Typography>Shipping Info</Typography>
                        <div className="confirmShippingAreaBox">
                            <div>
                                <p>Name:</p>
                                <span>{user.name}</span>
                            </div>
                            <div>
                                <p>Phone:</p>
                                <span>{shippingInfo.phoneNo}</span>
                            </div>
                            <div>
                                <p>Address:</p>
                                <span>{address}</span>
                            </div>

                        </div>
                    </div>
                    <div className="confirmCartItems">
                        <Typography>Your Cart Items:</Typography>
                        <div className='confirmCartItemContainer'>
                            {
                                cartItems &&
                                cartItems.map((item) => (
                                    <div key={item.product}>
                                        <img src={item.image} alt="product" />
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>{" "}
                                        <span>
                                            {item.quantity} &#215; &#x20B9;{item.price} = {" "}
                                            <b>&#x20B9;{item.price * item.quantity}</b>
                                        </span>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
                {/*  */}
                <div>
                    <div className="orderSummary">
                        <Typography>Order Summery</Typography>
                        <div>
                            <div>
                                <p>Subtotal:</p>
                                <span>&#x20B9;{subtotal}</span>
                            </div>
                            <div>
                                <p>Shipping Charges:</p>
                                <span>&#x20B9;{shippingCharges}</span>
                            </div>
                            <div>
                                <p>GST:</p>
                                <span>&#x20B9;{tax}</span>
                            </div>
                        </div>

                        <div className="orderSummaryTotal">
                            <p>
                                <b>Total:</b>
                            </p>
                            <span>&#x20B9;{totalPrice}</span>
                        </div>
                        <button onClick={proceedToPayment}>Proceed To Payment</button>
                    </div>
                </div>

            </div>
        </Fragment>
    )
}

export default ConfirmOrder
