import React, { Fragment } from 'react'
import CartItemCard from "./CartItemCard.jsx"
import "./Cart.css";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addItemsToCart, removeItemFromCart } from '../../actions/cartAction.js'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';
const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart)


  // Increase quantity of products
  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      return
    }
    dispatch(addItemsToCart(id, newQty))
  }

  // Decrease quantity of product
  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (newQty < 1) {
      return
    }
    dispatch(addItemsToCart(id, newQty))
  }

  // Delete from cart
  const deletecartItem = (id) => {
    dispatch(removeItemFromCart(id))
  }

  const checkoutHandler = () => {
      navigate("/login?redirect=shipping");
  }

  return (
    <Fragment>
      {
        cartItems.length === 0 ?(
      <div className='emptyCart'>
        <RemoveShoppingCartIcon/>
     <Typography>No Product in Your Cart</Typography>
     <Link to="/products">View Products</Link>
      </div>
        ): (
          <Fragment>
      <div className="cartPage">
        <div className='cartHeader'>
          <p>Product</p>
          <p>Quantity</p>
          <p>Subtotal</p>
        </div>

        {
          cartItems && cartItems.map((item) => (
            <div className="cartContainer" key={item.product}>
              <CartItemCard item={item} deletecartItem={deletecartItem} />
              <div className="cartInput">
                <button onClick={() => decreaseQuantity(item.product, item.quantity, item.stock)}>-</button>
                <input type="number" value={item.quantity} readOnly />
                <button onClick={() => increaseQuantity(item.product, item.quantity, item.stock)}>+</button>
              </div>
              <p className='cartSubtotal'><span>&#8377;</span>{`${item.price * item.quantity}`}</p>
            </div>
          )
          )
        }

        <div className="cartGrossProfit">
          <div></div>
          <div className="cartGrossProfitBox">
            <p>Gross Total</p>
            <p><span>&#8377;</span>{cartItems.reduce(
              (acc, item)=> acc + item.quantity * item.price, 0)}</p>
          </div>
          <div></div>
          <div className="checkOutBtn">
            <button onClick={checkoutHandler}>Check Out</button>
          </div>
        </div>

      </div>
    </Fragment>
        )
      }
    </Fragment>
  )
}

export default Cart
