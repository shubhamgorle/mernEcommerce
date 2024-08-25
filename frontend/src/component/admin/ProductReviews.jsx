import React, { Fragment, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';
import "./productReviews.css"
import { getAllReviews, clearErrors, deleteReview } from '../../actions/productaction';
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import Metadata from '../layout/Metadata';
import SideBar from './SideBar.jsx';
import DeleteIcon from "@material-ui/icons/Delete"
import StarIcon from "@material-ui/icons/Star"
import Loader from '../layout/loader/Loader.jsx';
import { DELETE_REVIEW_RESET } from '../../constatnce/productConstant.js';
const ProductReviews = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate()
    const { isDeleted, error: deleteError } = useSelector((state) => state.review)
    const { error, reviews, loading } = useSelector((state) => state.productReviews)
    const [productId, setProductId] = useState("")
    const handleDeleteReview = (reviewId, productId) => {
        dispatch(deleteReview(reviewId, productId ))
    }
    const columns = [
        { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.6 },
        { field: "user", headerName: "User", minWidth: 200, flex: 0.3 },
        { field: "comment", headerName: "Comment", minWidth: 350, flex: 1 },
        {
            field: "rating", headerName: "Rating", minWidth: 180, flex: 0.4, type: "number",
            cellClassName: (params) => {
                return (params.row.rating >= 3 ? "greenColor" : "redColor")
            }
        },
        {
            field: "actions", headerName: "Actions", minWidth: 150, flex: 0.3, type: "number", sortable: false, renderCell: (params) => {
                return (
                    <Fragment>
                        <Button onClick={() => handleDeleteReview(params.row.id, productId)}><DeleteIcon/></Button>
                    </Fragment>
                )
            }
        },
    ]

    const rows = [];
    reviews &&
        reviews.forEach((item, index) => {
            rows.push({
                id: item._id,
                user: item.name,
                comment: item.comment,
                rating: item.rating
            })
        })
        
        const productReviewsSubmitHandler = (e)=>{
            e.preventDefault();
           dispatch(getAllReviews(productId))
        }
    useEffect(() => {
        if(productId.length === 24){
           dispatch(getAllReviews(productId))
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }
        if (isDeleted) {
            alert.success("Review Deleted Successfully");
            navigate("/admin/reviews");
            dispatch({ type: DELETE_REVIEW_RESET })
        }
    }, [dispatch, error, alert, isDeleted, deleteError, navigate, productId])


    return (
        <Fragment>
            {
                loading ? <Loader/> : <Fragment>
                    <Metadata title={`ALL REVIEWS - Admin`} />
                    <div className="dashboard">
                        <SideBar />
                        <div className="productReviewsContainer">
                            <form
                                className='productReviewsForm'
                                onSubmit={productReviewsSubmitHandler}
                            >

                                <h1 className='productReviewsFormHeading'>ALL REVIEWS</h1>

                                <div>
                                    <StarIcon />
                                    <input type="text"
                                        placeholder='Product Id'
                                        required
                                        value={productId}
                                        onChange={(e) => setProductId(e.target.value)} />
                                </div>

                                
                                <Button
                                    id="createProductButton"
                                    type='submit'
                                    disabled={loading ? true : false || productId === "" ? true : false}>
                                    Search
                                </Button>
                            </form>
                          
                           {
                                reviews && reviews.length > 0 ? (
                                <DataGrid
                                rows={rows}
                                columns={columns}
                                disableRowSelectionOnClick
                                className='productListTable'
                                autoHeight
                                initialState={{
                                    pagination: {
                                      paginationModel: { pageSize: 9, page: 0 },
                                    },
                                  }}
                                  pageSizeOptions={[9]} 
                            />  
                            ) :
                            (
                                <h1 className='productReviewsFormHeading'>No Reviews Found</h1>
                            )
                            }
                        </div>
                    </div>
                </Fragment>
            }
        </Fragment>
    )
}



export default ProductReviews
