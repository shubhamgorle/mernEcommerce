import "./ForgotPassword.css"
import React, { Fragment, useEffect, useState } from 'react'
import "./ForgotPassword.css"
import Loader from "../layout/loader/Loader"
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Metadata from '../layout/Metadata';
import { useDispatch, useSelector } from "react-redux"
import { forgotPassword, clearErrors } from "../../actions/userActions"
import { useAlert } from 'react-alert'
const ForgotPassword = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { error, message, loading } = useSelector(state => state.forgotPassword);
    const [email, setEmail] = useState("")


    const forgotPasswordSubmit = (e) => {
        e.preventDefault();
        const myform = new FormData();
        myform.set("email", email)
        dispatch(forgotPassword(myform))
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (message) {
            alert.success(message)
        }
    }, [dispatch, error, alert, message])

    return (
        <Fragment>
            {loading ? <Loader /> : <Fragment>
                <Metadata title="forgot password" />
                <div className='forgotPasswordContainer'>
                    <div className='forgotPasswordBox'>
                        <h2 className='forgotPasswordHeading'>Forgot Password</h2>
                        <form className='forgotPasswordForm'
                            onSubmit={forgotPasswordSubmit}
                        >

                            <div className='forgotPasswordEmail'>
                                <MailOutlineIcon />
                                <input
                                    type="text"
                                    placeholder="Email"
                                    required
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <input
                                type='submit'
                                value="Send"
                                className='updateProfileBtn'
                            />
                        </form>
                    </div>
                </div>
            </Fragment>}
        </Fragment>
    )
}

export default ForgotPassword
