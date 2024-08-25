import React, { Fragment, useEffect, useState } from 'react'
import "./UpdateProfile.css"
import Loader from "../layout/loader/Loader"
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Metadata from '../layout/Metadata';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import { useDispatch, useSelector } from "react-redux"
import { updateProfile, clearErrors, loadUser } from "../../actions/userActions"
import { useAlert } from 'react-alert'
import { useNavigate } from 'react-router-dom';
import { UPDATE_PROFILE_RESET } from '../../constatnce/userConstants';
const UpdatedProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const alert = useAlert();
    const { user } = useSelector(state => state.user);
    const { error, isUpdated, loading } = useSelector(state => state.profile);

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=")


    const updateProfileSubmit = (e) => {
        e.preventDefault();
        const myform = new FormData();
        myform.set("name", name)
        myform.set("email", email)
        myform.set("avatar", avatar)
        dispatch(updateProfile(myform))
    }

    const updateProfileDataChange = (e) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result);
                }
            }
            reader.readAsDataURL(e.target.files[0]);
    }
    useEffect(() => {
        if(user){
            setName(user.name)
            setEmail(user.email)
            setAvatarPreview(user.avatar.url)
        }
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (isUpdated) {
            alert.success("Profile Updated Successfully");
            dispatch(loadUser())
            navigate("/account")
            dispatch({type:UPDATE_PROFILE_RESET})
        }
    }, [dispatch, alert, error, navigate,isUpdated, user])


    return (
        <Fragment>
            {loading ? <Loader/>:<Fragment>
            <Metadata title="update profile"/>
                    <div className='updateProfileContainer'>
                        <div className='updateProfileBox'>
                            <h2 className='updateProfileHeading'>Update Profile</h2>
                        <form className='updateProfileForm'
                                encType='multipart/form-data'
                                onSubmit={updateProfileSubmit}
                            >
                                <div className='updateProfileName'>
                                    <AccountBoxOutlinedIcon />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        required
                                        name="name"
                                        value={name}
                                        onChange={(e)=>setName(e.target.value)}
                                    />
                                </div>

                                <div className='updateProfileEmail'>
                                    <MailOutlineIcon />
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        value={email}
                                        onChange={(e)=>setEmail(e.target.value)}
                                    />
                                </div>

                                <div id='updateProfileImage'>
                                    <img src={avatarPreview} alt='Avatar Preview' />
                                    <input
                                        type='file'
                                        name='avatar'
                                        accept='image/*'
                                        onChange={updateProfileDataChange}
                                    />
                                </div>
                                <input
                                    type='submit'
                                    value="Update"
                                    className='updateProfileBtn'
                                />
                            </form>
                            </div>
                            </div>
                            </Fragment>}
        </Fragment>
    )
}

export default UpdatedProfile
