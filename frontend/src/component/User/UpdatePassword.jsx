import React, { Fragment, useEffect, useState } from 'react'
import "./UpdatePassword.css"
import Loader from "../layout/loader/Loader"
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockIcon from '@mui/icons-material/Lock'
import Metadata from '../layout/Metadata';
import { useDispatch, useSelector } from "react-redux"
import { updatePassword, clearErrors } from "../../actions/userActions"
import { useAlert } from 'react-alert'
import { useNavigate } from 'react-router-dom';
import { UPDATE_PASSWORD_RESET } from '../../constatnce/userConstants';
const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const alert = useAlert();
  const { error, isUpdated, loading } = useSelector(state => state.profile);

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")


  const updatePasswordSubmit = (e) => {
    e.preventDefault();
    const myform = new FormData();
    myform.set("oldPassword", oldPassword)
    myform.set("newPassword", newPassword)
    myform.set("confirmPassword", confirmPassword)
    dispatch(updatePassword(myform))
  }

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
    if (isUpdated) {
      alert.success("Password Changed Successfully");
      navigate("/account")
      dispatch({ type: UPDATE_PASSWORD_RESET })
    }
  }, [dispatch, alert, error, navigate, isUpdated])
  return <Fragment>
    {loading ? <Loader /> : <Fragment>
      <Metadata title="Change Password" />
      <div className='updatePasswordContainer'>
        <div className='updatePasswordBox'>
          <h2 className='updatePasswordHeading'>Change Password</h2>
          <form className='updatePasswordForm'
            onSubmit={updatePasswordSubmit}
          >
            <div className='loginPassword'>
              <VpnKeyIcon />
              <input type="password"
                placeholder='Old Password'
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className='loginPassword'>
              <LockOpenIcon />
              <input type="password"
                placeholder='New Password'
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className='loginPassword'>
              <LockIcon />
              <input type="password"
                placeholder='Confirm Password'
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <input
              type='submit'
              value="Change Password"
              className='updatePasswordBtn'
            />
          </form>
        </div>
      </div>
    </Fragment>}
  </Fragment>

}

export default UpdatePassword





