import React from 'react';
import "./OrderSuccess.css";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
const OrderSuccess = () => {
  return (
    <div className='orderSuccess'>
      <CheckCircleIcon/>
     <Typography>Your Order has been Placed successFully</Typography>
     <Link to='/orders'>View Orders</Link>
    </div>
  )
}

export default OrderSuccess
