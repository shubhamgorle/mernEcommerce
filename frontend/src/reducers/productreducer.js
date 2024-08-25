import {
    ALL_PRODUCT_FAIL,
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    CLEAR_ERRORS,
    PRODUCT_DETAIL_REQUEST,
    PRODUCT_DETAIL_FAIL,
    PRODUCT_DETAIL_SUCCESS,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_RESET,
    NEW_REVIEW_FAIL,
    NEW_REVIEW_REQUEST,
    ADMIN_PRODUCT_FAIL,
    ADMIN_PRODUCT_REQUEST,
    ADMIN_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_RESET,
    NEW_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_RESET,
    UPDATE_PRODUCT_RESET,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
    DELETE_REVIEW_RESET,
    ALL_REVIEW_REQUEST,
    ALL_REVIEW_SUCCESS,
    ALL_REVIEW_FAIL
} from "../constatnce/productConstant";

export const productReducer = ((state = { products: [] }, action) => {
    if (action.type === ALL_PRODUCT_REQUEST || action.type === ADMIN_PRODUCT_REQUEST) {
        return {
            loading: true,
            products: []
        }
    }
    else if (action.type === ALL_PRODUCT_SUCCESS) {
        return {
            loading: false,
            products: action.payload.products,
            productsCount: action.payload.productsCount,
            resultPerPage: action.payload.resultPerPage,
            filterdProductCount: action.payload.filterdProductCount
        }
    }
    else if (action.type === ADMIN_PRODUCT_SUCCESS) {
        return {
            loading: false,
            products: action.payload
        }
    }
    else if (action.type === ALL_PRODUCT_FAIL || action.type === ADMIN_PRODUCT_FAIL) {
        return {
            loading: false,
            error: action.payload
        }
    }
    else if (action.type === CLEAR_ERRORS) {
        return {
            ...state,
            error: null
        }
    }
    else {
        return state
    }
})



export const productDetailReducer = ((state = { product: {} }, action) => {
    if (action.type === PRODUCT_DETAIL_REQUEST) {
        return {
            loading: true,
            ...state
        }
    }
    else if (action.type === PRODUCT_DETAIL_SUCCESS) {
        return {
            loading: false,
            product: action.payload,
        }
    }
    else if (action.type === PRODUCT_DETAIL_FAIL) {
        return {
            loading: false,
            error: action.payload
        }
    }
    else if (action.type === CLEAR_ERRORS) {
        return {
            ...state,
            error: null
        }
    }
    else {
        return state
    }
})

export const newReviewReducer = ((state = {}, action) => {
    switch (action.type) {
        case NEW_REVIEW_REQUEST:
            return {
                ...state,
                loading: true
            }
        case NEW_REVIEW_SUCCESS:
            return {
                loading: false,
                success: action.payload,
            }
        case NEW_REVIEW_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case NEW_REVIEW_RESET:
            return {
                ...state,
                loading: false,
                success: false
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
})

// create new product
export const newProductReducer = ((state = { product: {} }, action) => {
    switch (action.type) {
        case NEW_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case NEW_PRODUCT_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                product: action.payload.product
            }
        case NEW_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case NEW_PRODUCT_RESET:
            return {
                ...state,
                loading: false,
                success: false
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
})



// delete product

export const deleteProductReducer = ((state = {}, action) => {
    switch (action.type) {
        case DELETE_PRODUCT_REQUEST:
        case UPDATE_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload,
            }
        case UPDATE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload,
            }
        case DELETE_PRODUCT_FAIL:
        case UPDATE_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case DELETE_PRODUCT_RESET:
            return {
                ...state,
                isDeleted: false
            }
        case UPDATE_PRODUCT_RESET:
            return {
                ...state,
                isUpdated: false
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
})


// ADMIN
export const productReviewsReducer = ((state = { reviews: [] }, action) => {
    if (action.type === ALL_REVIEW_REQUEST) {
        return {
            ...state,
            loading: true
        }
    }
    else if (action.type === ALL_REVIEW_SUCCESS) {
        return {
            loading: false,
            reviews: action.payload,
        }
    }
    else if (action.type === ALL_REVIEW_FAIL) {
        return {
            ...state,
            loading: false,
            error: action.payload
        }
    }
    else if (action.type === CLEAR_ERRORS) {
        return {
            ...state,
            error: null
        }
    }
    else {
        return state
    }
})


export const reviewsReducer = ((state = {}, action) => {
    switch (action.type) {
        case DELETE_REVIEW_REQUEST:
            return {
                ...state,
                loading: true
            }
        case DELETE_REVIEW_SUCCESS:
            return {
                loading: false,
                isDeleted: action.payload,
            }
        case DELETE_REVIEW_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case DELETE_REVIEW_RESET:
            return {
                ...state,
                isDeleted: false
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
})