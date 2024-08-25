import React, { Fragment, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import "./MyOrders.css";
import { clearErrors, myOrders } from '../../actions/orderAction';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layout/loader/Loader';
import { Link } from 'react-router-dom';
import { useAlert } from 'react-alert';
import Metadata from '../layout/Metadata';
import LaunchIcon from "@material-ui/icons/Launch"

const MyOrders = () => {
  const { user } = useSelector((state) => state.user)
  const { loading, error, orders } = useSelector((state) => state.myOrders)
  const dispatch = useDispatch();
  const alert = useAlert();
  const columns = [
    { field: 'id', headerName: 'Order ID', minWidth: 300 , flex : 1},
    { field: 'status', headerName: 'Status', minWidth: 150, flex : 0.5, cellClassName: (params)=>{
        return (params.row.status === "Delivered" ? "greenColor" : "redColor")
    } },
    { field: 'itemsQty', headerName: 'Items Qty', minWidth: 150, flex : 0.3 , type:"number"},
    { field: 'amount', headerName: 'Amount', minWidth: 270, flex : 0.5 , type:"number"},
    { field: 'actions', headerName: 'Actions', minWidth: 150,  type:"number", sortable:false,
      renderCell: (params)=>{
        return(
          <Link to={`/order/${params.row.id}`}>
            <LaunchIcon/>
          </Link>
        )
      }
    },
  ];
  const rows = []
  orders &&
  orders.forEach((item, index)=>{
     rows.push({
      itemsQty : item.orderItems.length,
      id:item._id,
      status:item.orderStatus,
      amount:item.totalPrice
     })
  })
useEffect(()=>{
  if(error){
    alert.error(error);
    dispatch(clearErrors())
  }
  dispatch(myOrders())
},[dispatch, alert, error])

  return (
    <Fragment>
      <Metadata title={`${user.name} - Orders`} />
      {
        loading ? (
          <Loader />
        ) : (
          <div className="myOrdersPage">
            <DataGrid
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              className='myOrdersTable'
              autoHeight
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 9, page: 0 },
                },
              }}
              pageSizeOptions={[9]} 
            />
            <div id='myOrdersHeading'>{user.name}'s Orders</div>
          </div>
        )
      }
    </Fragment>
  )
}

export default MyOrders
