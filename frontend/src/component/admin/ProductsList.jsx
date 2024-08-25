import React,{Fragment, useEffect} from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';
import "./ProductsList.css"
import { getAdminProducts, clearErrors, deleteProduct} from '../../actions/productaction';
import { useAlert } from 'react-alert';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import Metadata from '../layout/Metadata';
import SideBar from './SideBar.jsx';
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import Loader from '../layout/loader/Loader.jsx';
import { DELETE_PRODUCT_RESET } from '../../constatnce/productConstant.js';
const ProductsList = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate()
    const {error, products} = useSelector((state)=>state.products)
     const {loading, isDeleted, error:deleteError} = useSelector((state)=>state.deleteProduct)

    const handleDelete = (id) =>{
        dispatch(deleteProduct(id))
    }
  const columns = [
     {field:"id", headerName:"Product ID", minWidth:200, flex:0.5},
     {field:"name", headerName:"Name", minWidth:350, flex:1},
     {field:"stock", headerName:"Stock", minWidth:150, flex:0.3,type:"number"},
     {field:"price", headerName:"Price", minWidth:270, flex:0.5, type:"number"},
     {field:"actions", headerName:"Actions", minWidth:150, flex:0.3, type:"number", sortable:false, renderCell:(params)=>{
        return(
            <Fragment>
                <Link to={`/admin/product/${params.row.id}`}><EditIcon/></Link>
                <Button onClick={()=>handleDelete(params.row.id)}><DeleteIcon/></Button>
            </Fragment>
        )
     }},
     
  ]
  
  const rows = [];
  products &&
  products.forEach((item, index)=>{
     rows.push({
         id:item._id,
         stock : item.stock,
         price:item.price,
         name:item.name
     })
  })
  useEffect(()=>{
    if(error){
        alert.error(error);
        dispatch(clearErrors());
    }
    if(deleteError){
        alert.error(deleteError);
        dispatch(clearErrors());
    }
    if(isDeleted){
        alert.success("Product Deleted Successfully");
        navigate("/admin/dashboard");
        dispatch({type:DELETE_PRODUCT_RESET})
    }
      dispatch(getAdminProducts())
  },[dispatch, error, alert, isDeleted, deleteError, navigate])


    return (
        <Fragment>
      {
        loading ? <Loader/> : <Fragment>
        <Metadata title={`ALL PRODUCTS - Admin`}/>
        <div className="dashboard">
            <SideBar/>
            <div className="productsListContainer">
                <h1 id="productListHeading">ALL PRODUCTS</h1>
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
            </div>
        </div>
     </Fragment>
      }
      </Fragment>
  )
}

export default ProductsList
