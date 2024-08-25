import React from 'react'
import "./CartItemCard.css"
import { Link } from 'react-router-dom';

const CartItemCard = ({item, deletecartItem}) => {
  
  return (
    <div className='CartItemCard'>
      <img src={item.image} alt="ssa" />
      <div>
        <Link to={`/product/${item.product}`}>{item.name}</Link>
        <span>Price: <span>&#8377;</span>{`${item.price}`}</span>
        <p onClick={()=>deletecartItem(item.product)}>Remove</p>
      </div>
    </div>
  )
}

export default CartItemCard
