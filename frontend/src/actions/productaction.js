import {
    ALL_PRODUCT_FAIL,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_REQUEST,
    CLEAR_ERRORS,
    PRODUCT_DETAIL_REQUEST,
    PRODUCT_DETAIL_FAIL,
    PRODUCT_DETAIL_SUCCESS,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    NEW_REVIEW_REQUEST,
    ADMIN_PRODUCT_FAIL,
    ADMIN_PRODUCT_REQUEST,
    ADMIN_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
    ALL_REVIEW_REQUEST,
    ALL_REVIEW_SUCCESS,
    ALL_REVIEW_FAIL
} from "../constatnce/productConstant";

import axios from 'axios'


// GET PRODUCT -----> USER
export const getProduct = (keyword = "", currentPage = 1, price = [0, 50000], category, ratings = 0) => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCT_REQUEST });
        let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]} &price[lte]=${price[1]}&ratings[gte]=${ratings}`
        if (category) {
            link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]} &price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`
        }
        let data = await axios.get(link);
        dispatch({
            type: ALL_PRODUCT_SUCCESS,
            payload: data.data
        })
    } catch (error) {
        dispatch({
            type: ALL_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}


// get all products for admin
export const getAdminProducts = () => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_PRODUCT_REQUEST });

        let { data } = await axios.get('/api/v1/admin/products');
        dispatch({
            type: ADMIN_PRODUCT_SUCCESS,
            payload: data.products
        })
    } catch (error) {
        dispatch({
            type: ADMIN_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

// clearing errors
export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS })
}

// get Product Details 
export const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAIL_REQUEST });
        let data = await axios.get(`/api/v1/products/${id}`);
        dispatch({
            type: PRODUCT_DETAIL_SUCCESS,
            payload: data.data.product
        })
    } catch (error) {
        console.log(error)
        dispatch({
            type: PRODUCT_DETAIL_FAIL,
            payload: error.response.data.message
        })
    }
}

// New Review
export const newReview = (reviewData) => async (dispatch) => {
    try {
        const config = {
            headers: { "Content-Type": "application/json" }
        }
        dispatch({ type: NEW_REVIEW_REQUEST });
        let { data } = await axios.put(`/api/v1/review`, reviewData, config);
        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.response.data.message
        })
    }
}

// Create product ---> Admin
export const createProduct = (productData) => async (dispatch) => {
    try {
        const config = {
            headers: { "Content-Type": "multipart/form-data" }
        }
        dispatch({ type: NEW_PRODUCT_REQUEST });
        let { data } = await axios.post(`/api/v1/admin/product/new`, productData, config);
        console.log(data)
        dispatch({
            type: NEW_PRODUCT_SUCCESS,
            payload: data
        })
    } catch (error) {
        console.log(error)
        dispatch({
            type: NEW_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}


// Delete product

export const deleteProduct = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_PRODUCT_REQUEST });
        let { data } = await axios.delete(`/api/v1/admin/product/${id}`);

        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

// Update Product 

export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });
        const config = {
            headers: { "Content-Type": "multipart/form-data" }
        }
        let { data } = await axios.put(`/api/v1/admin/product/${id}`, productData, config);
        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        console.log(error)
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

// get all reviews of a product
// id---> id of product 
export const getAllReviews = (id) => async (dispatch) => {
    try {
        dispatch({ type: ALL_REVIEW_REQUEST });
        let { data } = await axios.get(`/api/v1/reviews?id=${id}`);
        dispatch({
            type: ALL_REVIEW_SUCCESS,
            payload: data.reviews
        })
    } catch (error) {
        dispatch({
            type: ALL_REVIEW_FAIL,
            payload: error.response.data.message
        })
    }
}

//  delete reviews of a product
// id---> id of review 
export const deleteReview = (reviewId, productId) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_REVIEW_REQUEST }); 
        let { data } = await axios.delete(`/api/v1/reviews?id=${reviewId}&productId=${productId}`);
        dispatch({
            type: DELETE_REVIEW_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: DELETE_REVIEW_FAIL,
            payload: error.response.data.message
        })
    }
}