import React, { Fragment, useEffect, useState } from 'react';
import "../Cart/ConfirmOrder.css"
import { useDispatch, useSelector } from 'react-redux';
import Metadata from '../layout/Metadata';
import { Link, useParams } from "react-router-dom";
import { Typography } from '@mui/material';
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import { Button } from '@mui/material';
import SideBar from './SideBar';
import { useAlert } from 'react-alert';
import Loader from '../layout/loader/Loader';
import { clearErrors, getOrderDetails, updateOrder } from '../../actions/orderAction';
import { UPDATE_ORDER_RESET } from '../../constatnce/orderConstants';
import "./ProcessOrder.css"
const ProcessOrder = () => {
    const { order, error, loading } = useSelector((state) => state.orderDetails);
    const {  isUpdated, error:updateError } = useSelector((state) => state.order);
    const { id } = useParams();
    const alert = useAlert()
    const [status, setStatus] = useState("");
    const dispatch = useDispatch();

    const processOrderSubmitHandler = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("status", status);
        dispatch(updateOrder(id, myForm))
    }
   
    useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch(clearErrors)
        }
        if(updateError) {
            alert.error(updateError);
            dispatch(clearErrors)
        }
        if(isUpdated) {
            alert.success("Order Updated Successfully");
           dispatch({type:UPDATE_ORDER_RESET})
        }
        dispatch(getOrderDetails(id))
    }, [dispatch, alert, error, id, isUpdated, updateError])
    return (
        <Fragment>
            <Metadata title="Process Order" />
            <div className="dashboard">
                <SideBar />
                <div className="newProductContainer">
                    {
                        loading ? <Loader /> :
                            <Fragment>
                                <div className='confirmOrderPage'
                                     style={{display:order.orderStatus === "Delivered" ? "block" : "grid"}}
                                
                                >

                                    <div>
                                        <div className="confirmShippingArea">
                                            <Typography>Shipping Info</Typography>
                                            <div className="orderDetailsContainerBox">
                                                <div>
                                                    <p>Name:</p>
                                                    <span>{order.user && order.user.name}</span>
                                                </div>
                                                <div>
                                                    <p>Phone:</p>
                                                    <span>{order.shippingInfo && order.shippingInfo.phoneNo}</span>
                                                </div>
                                                <div>
                                                    <p>Address:</p>
                                                    <span>{order && order.shippingInfo && `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}</span>
                                                </div>
                                            </div>

                                            <Typography>Payment</Typography>
                                            <div className="orderDetailsContainerBox">
                                                <div>
                                                    <p className=
                                                        {order.paymentInfo &&
                                                            order.paymentInfo.status === "succeeded"
                                                            ? "greenColor"
                                                            : "redColor"
                                                        }>
                                                        {order.paymentInfo &&
                                                            order.paymentInfo.status === "succeeded"
                                                            ? "PAID"
                                                            : "NOT PAID"
                                                        }
                                                    </p>
                                                </div>

                                                <div>
                                                    <p>Amount</p>
                                                    <span>{order.totalPrice && order.totalPrice}</span>
                                                </div>
                                            </div>


                                            <Typography>Order Status</Typography>
                                            <div className="orderDetailsContainerBox">
                                                <div>
                                                    <p
                                                        className={order.orderStatus && order.orderStatus === "Delivered"
                                                            ? "greenColor"
                                                            : "redColor"
                                                        }
                                                    >
                                                        {order.orderStatus && order.orderStatus}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="confirmCartItems">
                                            <Typography>Your Cart Items:</Typography>
                                            <div className='confirmCartItemContainer'>
                                                {
                                                    order.orderItems &&
                                                    order.orderItems.map((item) => (
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
                                    <div style={{display:order.orderStatus === "Delivered" ? "none" : "block"}}>
                                        <form
                                            className='updateOrderForm'
                                            onSubmit={processOrderSubmitHandler}
                                        >
                                            <h1>Process Order</h1>
                                            <div>
                                                <AccountTreeIcon />
                                                <select onChange={(e) => setStatus(e.target.value)}>
                                                 <option value="">Choose Category</option>
                                                   {
                                                    order.orderStatus === "Pending" && (
                                                        <option value="Shipped">Shipped</option>
                                                    )
                                                   }
                                                   {
                                                    order.orderStatus === "Shipped" && (
                                                        <option value="Delivered">Delivered</option>

                                                    )
                                                   }
                                                    
                                                </select>
                                            </div>
                                            <Button
                                                id="createProductButton"
                                                type='submit'
                                                disabled={loading ? true : false || status === "" ? true : false}>PROCESS</Button>
                                        </form>
                                    </div>
                                </div>
                            </Fragment>
                    }



                </div>
            </div>

        </Fragment>
    )
}
export default ProcessOrder
