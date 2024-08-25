import React,{Fragment, useEffect} from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';
import "./ProductsList.css"
import { useAlert } from 'react-alert';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import Metadata from '../layout/Metadata';
import SideBar from './SideBar.jsx';
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import Loader from '../layout/loader/Loader.jsx';
import { deleteOrder, getAllOrders, clearErrors } from '../../actions/orderAction.js';
import { DELETE_ORDER_RESET } from '../../constatnce/orderConstants.js';
const OrdersList = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate()
    const {error, orders} = useSelector((state)=>state.allOrders)
     const {loading, isDeleted, error:deleteError} = useSelector((state)=>state.order)

    const deleteOrderHandler = (id) =>{
        dispatch(deleteOrder(id))
    }
  const columns = [
    { field: 'id', headerName: 'Order ID', minWidth: 300 , flex : 1},
    { field: 'status', headerName: 'Status', minWidth: 150, flex : 0.5, cellClassName: (params)=>{
        return (params.row.status === "Delivered" ? "greenColor" : "redColor")
    } },
    { field: 'itemsQty', headerName: 'Items Qty', minWidth: 150, flex : 0.3 , type:"number"},
    { field: 'amount', headerName: 'Amount', minWidth: 270, flex : 0.5 , type:"number"},
     {field:"actions", headerName:"Actions", minWidth:150, flex:0.3, type:"number", sortable:false, renderCell:(params)=>{
        return(
            <Fragment>
                <Link to={`/admin/order/${params.row.id}`}><EditIcon/></Link>
                <Button onClick={()=>deleteOrderHandler(params.row.id)}><DeleteIcon/></Button>
            </Fragment>
        )
     }},
     
  ]
  
  const rows = [];
  orders &&
  orders.forEach((item, index)=>{
     rows.push({
         id:item._id,
         itemsQty : item.orderItems.length,
         amount:item.totalPrice,
         status:item.orderStatus
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
        alert.success("Order Deleted Successfully");
        navigate("/admin/orders");
        dispatch({type:DELETE_ORDER_RESET})
    }
      dispatch(getAllOrders())
  },[dispatch, error, alert, isDeleted, deleteError, navigate])


    return (
        <Fragment>
      {
        loading ? <Loader/> : <Fragment>
        <Metadata title={`ALL ORDERS - Admin`}/>
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

export default OrdersList
