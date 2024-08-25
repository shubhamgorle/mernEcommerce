import React, { Fragment, useEffect, useState } from 'react'
import "./products.css"
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, getProduct } from '../../actions/productaction'
import Loader from '../layout/loader/Loader'
import ProductCard from '../Home/ProductCard'
import { useParams } from 'react-router-dom'
import Pagination from "react-js-pagination"
import { Slider, Typography } from '@mui/material'
import { useAlert } from 'react-alert'
import Metadata from '../layout/Metadata'
const Categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones"
]

const Products = () => {
  const dispatch = useDispatch();
  const Alert = useAlert();
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 50000]);
  const [category, setCategory] = useState("");
  const [ratings, setRating] = useState(0);
  const { loading, products, productsCount, resultPerPage, filterdProductCount, error } = useSelector((state) => state.products)

  const { keyword } = useParams();

  const setCurrentPageNo = (e) => {
    setCurrentPage(e)
  }

  const priceHandler = (e, newprice) => {
    setPrice(newprice)
  }

  useEffect(() => {
    if (error) {
      Alert.error(error)
      dispatch(clearErrors())
    }
    dispatch(getProduct(keyword, currentPage, price, category, ratings))
  }, [dispatch, keyword, currentPage, price, category, ratings, Alert, error])

  let count = filterdProductCount;

  return (
    <Fragment>
      {
        loading ? <Loader /> :
          <Fragment>
            <Metadata title="PRODUCTS -- ECOMMERCE"/>
            <h2 className='productsHeading'>Products</h2>
            <div className='products'>
              {
                products && products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              }
            </div>


            <div className='filterBox'>
              <Typography>Price</Typography>
              <Slider
                value={price}
                onChange={priceHandler}
                valueLabelDisplay='auto'
                aria-labelledby='range slider'
                min={0}
                max={60000}
                size="small"
                sx={{
                  color: "rgb(255,99,71)"
                }}
              />

              <Typography>Categories</Typography>
              <ul className='categoryBox'>
                {
                  Categories.map((category, idx) => (
                    <li
                      className='category-link'
                      key={idx}
                      onClick={() => setCategory(category)}>
                      {category}
                    </li>
                  ))
                }
              </ul>

              <fieldset>
                <Typography component="legent">Ratings Above</Typography>
                <Slider value={ratings}
                  onChange={(e, newRating) => {
                    setRating(newRating)
                  }}
                  aria-labelledby='continuous-slider'
                  min={0}
                  max={5}
                  size="small"
                  sx={{
                    color: "rgb(255,99,71)"
                  }}
                  valueLabelDisplay='auto'
                ></Slider>
              </fieldset>

            </div>

            {
              resultPerPage < count &&
              <div className='paginationBox'>
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={productsCount}
                  onChange={setCurrentPageNo}
                  nextPageText="Next"
                  prevPageText="Prev"
                  firstPageText="First"
                  lastPageText="Last"
                  itemClass='page-item'
                  linkClass='page-link'
                  activeClass='pageItemActive'
                  activeLinkClass='pageLinkActive'
                />
              </div>
            }
          </Fragment>
      }
    </Fragment>
  )
}

export default Products
