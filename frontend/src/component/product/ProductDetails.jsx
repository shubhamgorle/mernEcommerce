import React, { Fragment, useEffect, useState } from 'react'
import Carousel from "react-material-ui-carousel"
import "./productDetails.css"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, getProductDetails, newReview } from '../../actions/productaction'
import { useNavigate, useParams } from "react-router-dom"
import ReviewCard from './ReviewCard'
import Loader from '../layout/loader/Loader'
import { useAlert } from 'react-alert'
import Metadata from '../layout/Metadata';
import { addItemsToCart } from '../../actions/cartAction'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@material-ui/core"
import { Rating } from "@material-ui/lab"
import { NEW_REVIEW_RESET } from '../../constatnce/productConstant'
const ProductDetails = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const { product, loading, error } = useSelector((state) => state.productDetails);
    const { success, error: reviewError } = useSelector((state) => state.newReview);
    const { isAuthenticated } = useSelector(state => state.user);
    const { id } = useParams();
    const [open, setOpen] = useState(false)
    const [rating, setRatings] = useState(0)
    const [comment, setComment] = useState("")
    const options = {
        size: window.innerWidth > 600 ? "large" : "small",
        value: product.ratings,
        readOnly:true,
        precision:0.5
    }
    const [quantity, setQuantity] = useState(1)
    const decreaseQuantity = () => {
        if (quantity <= 1) {
            return
        }
        const qty = quantity - 1;
        setQuantity(qty)
    }
    const increaseQuantity = () => {
        if (product.stock <= quantity) {
            return
        }
        const qty = quantity + 1;
        setQuantity(qty)
    }
    const addToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity))
        alert.success("Item Added To Cart");
    }

    // add new review
    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true)

    }
    // review submit handler
    const reviewSubmitHandler = (e) => {
        e.preventDefault()
        if (isAuthenticated) {
            const myform = new FormData();
            myform.set("rating", rating);
            myform.set("comment", comment);
            myform.set("productId", id)
            dispatch(newReview(myform))
            setOpen(false)
        }
        else {
            alert.success("Please login first to share your review");
            navigate("/login")
        }
    }
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (reviewError) {
            alert.error(reviewError)
            dispatch(clearErrors())
        }
        if (success) {
            alert.success("Review Submitted Successfully");
            dispatch({ type: NEW_REVIEW_RESET });
        }
        dispatch(getProductDetails(id))
    }, [dispatch, id, alert, error, success, reviewError])
    return (
        <Fragment>
            {
                loading ? (<Loader />) : (
                    <Fragment>
                        <Metadata title={`${product.name} -- ECOMMERCE`} />

                        <div className="ProductDetails">
                            <div>
                                <Carousel>
                                    {
                                        product.Images &&
                                        product.Images.map((item, idx) => (
                                            <img
                                                className="CarouselImage"
                                                key={idx}
                                                src={item.url}
                                                alt={`${idx} slide`}
                                            />
                                        ))}
                                </Carousel>
                            </div>

                            <div>
                                <div className='detailsBlock-1'>
                                    <h2>{product.name}</h2>
                                    <p>Product # {product._id}</p>
                                </div>

                                <div className='detailsBlock-2'>
                                    <Rating {...options} />
                                    <span className='detailsBlock-2-span' >({product.numOfReviews}) Reviews</span>
                                </div>

                                <div className='detailsBlock-3'>
                                    <h1><span>&#8377;</span>{product.price}</h1>
                                    <div className='detailsBlock-3-1'>
                                        <div className="detailsBlock-3-1-1">
                                            <button onClick={decreaseQuantity}>-</button>
                                            <input type="number" readOnly value={quantity} />
                                            <button onClick={increaseQuantity}>+</button>
                                        </div>
                                        <button disabled={product.stock < 1 ? true : false} onClick={addToCartHandler}>Ad to Cart</button>
                                    </div>

                                    <p>
                                        Status:
                                        <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                                            {product.stock < 1 ? "OutOfStock" : "InStock"}
                                        </b>
                                    </p>

                                </div>

                                <div className='detailsBlock-4'>
                                    Discription : <p>{product.description}</p>
                                </div>
                                <button className='submitReviews' onClick={submitReviewToggle}>Submit Reviews</button>
                            </div>
                        </div>

                        <h3 className='reviewsHeading'>REVIEWS</h3>
                        <Dialog
                            aria-labelledby='simple-dialog-title'
                            open={open}
                            onClose={submitReviewToggle}
                        >
                            <DialogTitle>Submit Review</DialogTitle>
                            <DialogContent className='submitDialog'>
                                <Rating
                                    onChange={(e) => setRatings(e.target.value)}
                                    value={rating}
                                    size="large"
                                />
                                <textarea
                                    cols='30'
                                    rows='5'
                                    className="submitDialogTextArea"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}

                                ></textarea>
                            </DialogContent>
                            <DialogActions>
                                <Button color="secondary">Cancel</Button>
                                <Button color="primary" onClick={reviewSubmitHandler}>Submit</Button>
                            </DialogActions>
                        </Dialog>
                        {
                            product.reviews && product.reviews[0] ? (
                                <div className='reviews'>
                                    {
                                        product.reviews.map((review) => <ReviewCard review={review} />)
                                    }
                                </div>
                            ) : (
                                <p className='noReviews'>No Reviews Yet</p>
                            )
                        }
                    </Fragment>
                )
            }
        </Fragment>
    )
}

export default ProductDetails
