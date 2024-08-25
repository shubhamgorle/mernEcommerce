import React, { Fragment, useEffect, useState } from 'react'
import Loader from "../layout/loader/Loader"
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock'
import Metadata from '../layout/Metadata';
import { useDispatch, useSelector } from "react-redux"
import { resetPassword, clearErrors } from "../../actions/userActions"
import { useAlert } from 'react-alert'
import { useNavigate, useParams } from 'react-router-dom';
import "./ResetPassword.css"


const ReserPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { token } = useParams();
  const alert = useAlert();
  const { error, success, loading } = useSelector(state => state.forgotPassword);

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const resetPasswordSubmit = (e) => {
    e.preventDefault();
    const myform = new FormData();
    myform.set("password", password)
    myform.set("confirmPassword", confirmPassword)
    dispatch(resetPassword(token, myform))
  }

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
    if (success) {
      alert.success("Password Updated Successfully");
      navigate("/login")
    }
  }, [dispatch, alert, error, navigate, success])

  return (
    <Fragment>
      {loading ? <Loader /> : <Fragment>
        <Metadata title="Change Password" />
        <div className='resetPasswordContainer'>
          <div className='resetPasswordBox'>
            <h2 className='resetPasswordHeading'>Change Password</h2>
            <form className='resetPasswordForm'
              onSubmit={resetPasswordSubmit}
            >

              <div className='loginPassword'>
                <LockOpenIcon />
                <input type="password"
                  placeholder='New Password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                value="Update"
                className='resetPasswordBtn'
              />
            </form>
          </div>
        </div>
      </Fragment>}
    </Fragment>
  )
}


export default ReserPassword
