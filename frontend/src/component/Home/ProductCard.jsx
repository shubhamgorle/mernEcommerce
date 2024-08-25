import React from 'react'
import "./Home.css"
import {Link} from 'react-router-dom'
import ReactStars from "react-rating-stars-component"

const ProductCard = ({product}) => {
  const options={
    edit:false,
    color:"rgba(20,20,20,0.1)",
    activeColor:"rgb(255,180,0)",
    size:window.innerWidth < 600 ? 14 : 27,
    value:product.ratings,
    isHalf:true
}
  return (
    <Link className='productCard' to={`/product/${product._id}`}>
    <img src={product.Images[0].url} alt={product.name} />
    <p>{product.name}</p>
    <div>
        <ReactStars {...options}/> <span>({product.numOfReviews} Reviews)</span>
    </div>
    <span><span>&#8377;</span>{product.price}</span>
    </Link>
  )
}
// html example

export default ProductCard
