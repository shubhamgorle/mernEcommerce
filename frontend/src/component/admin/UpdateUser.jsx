
import React, { Fragment, useState, useEffect } from 'react';
import "./NewProduct.css";
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { Button } from '@mui/material';
import Metadata from '../layout/Metadata';
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonIcon from "@material-ui/icons/Person";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SideBar from './SideBar';
import Loader from '../layout/loader/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { UPDATE_USERS_RESET } from '../../constatnce/userConstants';
import { getUserDetails, updateUser, clearErrors } from '../../actions/userActions';

const UpdateUser = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const { id } = useParams()

    const { loading: updateLoading, error: updateError, isUpdated } = useSelector((state) => state.profile)
    const {  error, user } = useSelector((state) => state.userDetails)

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");


    useEffect(() => {
        if(user && user._id !== id) {
            dispatch(getUserDetails(id))
        }
        else {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }
        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors())
        }
        if (isUpdated) {
            alert.success("User Updated Successfully");
            navigate("/admin/users");
            dispatch({ type: UPDATE_USERS_RESET })
        }
    }, [dispatch, alert, error, isUpdated, navigate, updateError, user, id]);

    const updateUserSubmitHandler = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("role", role);
        dispatch(updateUser(id, myForm))
    }



    return (
        <Fragment>
            {updateLoading ? <Loader /> : <Fragment>
                <Metadata title="Update User" />
                <div className="dashboard">
                    <SideBar />
                    <div className="newProductContainer">

                        <form
                            className='createProductForm'
                            onSubmit={updateUserSubmitHandler}
                        >

                            <h1>Update User</h1>
                            <div>
                                <PersonIcon />
                                <input type="text"
                                    placeholder='Name'
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div>
                                <MailOutlineIcon />
                                <input type="text"
                                    placeholder='Email'
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div>
                                <VerifiedUserIcon />
                                <select value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option value="">Choose Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                            <Button
                                id="createProductButton"
                                type='submit'
                                disabled={updateLoading ? true : false || role === "" ? true : false}>
                                Update
                                </Button>
                        </form>
                    </div>
                </div>
            </Fragment>
            }
        </Fragment>

    )
}


export default UpdateUser
