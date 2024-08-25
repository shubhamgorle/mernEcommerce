import React, { Fragment, useEffect, useRef, useState } from 'react'
import "./LoginSignUp.css"
import Loader from "../layout/loader/Loader"
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import { Link } from 'react-router-dom'
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useDispatch, useSelector } from "react-redux"
import { login,register, clearErrors } from "../../actions/userActions"
import { useAlert } from 'react-alert'
import { useNavigate, useLocation  } from 'react-router-dom';

const LoginSignup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const alert = useAlert();
    const { error, loading, isAuthenticated } = useSelector(state => state.user)
    const loginTab = useRef(null)
    const registerTab = useRef(null)
    const switcherTab = useRef(null)
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    })
    const { name, email, password } = user;
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=")
    const loginSubmit = (e) => {
        e.preventDefault();
        dispatch(login(loginEmail, loginPassword));
    }
    const registerSubmit = (e) => {
        e.preventDefault();
        const myform = new FormData();
        myform.set("name", name)
        myform.set("email", email)
        myform.set("password", password)
        myform.set("avatar", avatar)
        dispatch(register(myform))
    }

    const registerDataChange = (e) => {
        if(e.target.name === "avatar") {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result);
                }
            }
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }
    // The search property returns the querystring part of a URL, including the question mark (?).
    // "/login?redirect=shipping"
    const redirect = location.search ? location.search.split("=")[1] : "account"
    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        } 
        if(isAuthenticated){
            navigate(`/${redirect}`)
        }
    }, [dispatch, alert, error, isAuthenticated, navigate,redirect])
    const switchTabs = (e, tab) => {
        if (tab === "login") {
            switcherTab.current.classList.add("shiftToNewtral")
            switcherTab.current.classList.remove("shiftToRight")

            registerTab.current.classList.remove("shiftToNewtralForm");
            loginTab.current.classList.remove("shiftToLeft")
        }
        if (tab === "register") {
            switcherTab.current.classList.add("shiftToRight")
            switcherTab.current.classList.remove("shiftToNewtral")

            registerTab.current.classList.add("shiftToNewtralForm");
            loginTab.current.classList.add("shiftToLeft")
        }
    }
    return <Fragment>
        {
            loading ? <Loader /> :
                <Fragment>
                    <div className='LoginSignUpContainer'>
                        <div className='LoginSignUpBox'>
                            <div>
                                <div className='login_signUp_toggle'>
                                    <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                                    <p onClick={(e) => switchTabs(e, "register")}>REGISER</p>
                                </div>
                                <button ref={switcherTab}></button>
                            </div>
                            <form className="loginForm"
                                ref={loginTab}
                                onSubmit={loginSubmit}
                            >
                                <div className='loginEmail'>
                                    <MailOutlineIcon />
                                    <input type="email"
                                        placeholder='Email' required
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                    />
                                </div>

                                <div className='loginPassword'>
                                    <LockOpenIcon />
                                    <input type="password"
                                        placeholder='Password'
                                        required
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}

                                    />
                                </div>
                                <Link to='/password/forgot'>Forget Password ?</Link>
                                <input type='submit' value='Login' className='loginBtn' />
                            </form>


                            <form className='signUpForm'
                                ref={registerTab}
                                encType='multipart/form-data'
                                onSubmit={registerSubmit}
                            >
                                <div className='signUpName'>
                                    <AccountBoxOutlinedIcon />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        required
                                        name="name"
                                        value={name}
                                        onChange={registerDataChange}
                                    />
                                </div>

                                <div className='signUpEmail'>
                                    <MailOutlineIcon />
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={registerDataChange}
                                    />
                                </div>

                                <div className='signUpPassword'>
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        required
                                        name="password"
                                        value={password}
                                        onChange={registerDataChange}
                                    />
                                </div>

                                <div id='registerImage'>
                                    <img src={avatarPreview} alt='Avatar Preview' />
                                    <input
                                        type='file'
                                        name='avatar'
                                        accept='image/*'
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <input
                                    type='submit'
                                    value="Register"
                                    className='signUpBtn'
                                />
                            </form>
                        </div>
                    </div>
                </Fragment>
        }
    </Fragment>
}

export default LoginSignup
