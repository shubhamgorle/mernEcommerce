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
import { getAllUsers , clearErrors, deleteUser} from '../../actions/userActions.js';
import { DELETE_USERS_RESET } from '../../constatnce/userConstants.js';
const UsersList = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate()
    const {error, users, loading} = useSelector((state)=>state.allUsers)
     const { isDeleted, error:deleteError, message, loading:deleteLoading} = useSelector((state)=>state.profile)

    const deleteUserHandler = (id) =>{
      dispatch(deleteUser(id))
    }
  const columns = [
     {field:"id", headerName:"User ID", minWidth:180, flex:0.8},
     {field:"email", headerName:"Email", minWidth:200, flex:1},
     {field:"name", headerName:"Name", minWidth:150, flex:0.5},
     {field:"role", headerName:"Role", minWidth:150, flex:0.3, 
      cellClassName: (params)=>{
        return (params.row.role === "admin" ? "greenColor" : "redColor")
     }
    },
     {field:"actions", headerName:"Actions", minWidth:150, flex:0.3, sortable:false, renderCell:(params)=>{
        return(
            <Fragment>
                <Link to={`/admin/user/${params.row.id}`}><EditIcon/></Link>
                <Button onClick={()=>deleteUserHandler(params.row.id)}><DeleteIcon/></Button>
            </Fragment>
        )
     }},
     
  ]
  
  const rows = [];
  users &&
  users.forEach((item, index)=>{
     rows.push({
         id:item._id,
         role : item.role,
         email:item.email,
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
        alert.success(message);
        navigate("/admin/users");
        dispatch({type:DELETE_USERS_RESET})
    }
      dispatch(getAllUsers())
  },[dispatch, error, alert, isDeleted, deleteError, navigate, message])


    return (
        <Fragment>
      {
        loading ? <Loader/> : <Fragment>
        <Metadata title={`ALL USERS - Admin`}/>
        {
          deleteLoading ? <Loader/> : <div className="dashboard">
          <SideBar/>
          <div className="productsListContainer">
              <h1 id="productListHeading">ALL USERS</h1>
              <DataGrid
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              className='productListTable'
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 9, page: 0 },
                },
              }}
              pageSizeOptions={[9]} 
              />
          </div>
      </div>
        }
     </Fragment>
      }
      </Fragment>
  )
}



export default UsersList
