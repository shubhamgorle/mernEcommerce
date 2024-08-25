import "./UpdateProduct.css"
import React, { Fragment, useState, useEffect } from 'react';
import "./NewProduct.css";
import { useSelector, useDispatch } from 'react-redux';
import {  clearErrors, updateProduct, getProductDetails} from '../../actions/productaction';
import { useAlert } from 'react-alert';
import { Button } from '@mui/material';
import Metadata from '../layout/Metadata';
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import StorageIcon from "@material-ui/icons/Storage";
import DescriptionIcon from "@material-ui/icons/Description";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

import SideBar from './SideBar';
import Loader from '../layout/loader/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { UPDATE_PRODUCT_RESET } from '../../constatnce/productConstant';


const UpdateProduct = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { loading, error:updateError, isUpdated } = useSelector((state) => state.deleteProduct);
  const {error, product} = useSelector((state)=>state.productDetails)
  const {id} = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [oldimages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
 
  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones"
  ]

  useEffect(() => {
    if(product && product._id !== id){
        dispatch(getProductDetails(id))
    }
    else{
        setName(product.name);
        setDescription(product.description)
        setPrice(product.price)
        setCategory(product.category)
        setStock(product.stock)
        setOldImages(product.Images)
    }
    if(updateError) {
        alert.error(updateError);
        dispatch(clearErrors())
      }
    if(error) {
      alert.error(error);
      dispatch(clearErrors())
    }
    if(isUpdated) {
      alert.success("Product Updated Successfully");
      navigate("/admin/products");
      dispatch({ type: UPDATE_PRODUCT_RESET })
    }
  }, [dispatch, alert, error, isUpdated, navigate, product,updateError, id]);

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);

    images.forEach((image) =>{
      myForm.append("images", image)
    })
    dispatch(updateProduct(id, myForm))
  }

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);
    setOldImages([])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result])
        }
      }
      reader.readAsDataURL(file)
    })
  }


  return (
    <Fragment>
    { loading ? <Loader/> : <Fragment>
      <Metadata title="Update Product" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">

          <form
            className='createProductForm'
            encType='multipart/form-data'
            onSubmit={updateProductSubmitHandler}
          >

            <h1>Create Product</h1>
            <div>
              <SpellcheckIcon />
              <input type="text"
                placeholder='Product Name'
                required
                value={name}
                onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <CurrencyRupeeIcon />
              <input type="number"
                placeholder='Price'
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)} />
            </div>

            <div>
              <DescriptionIcon />

              <textarea
                placeholder='Product Description'
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)} ></textarea>
            </div>

            <div>
              <AccountTreeIcon />
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Choose Category</option>
                {
                  categories.map((cate) => (
                    <option key={cate} value={cate}>{cate}</option>
                  ))
                }
              </select>
            </div>

            <div>
              <StorageIcon />
              <input type="number"
                placeholder='Stock'
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)} />
            </div>

            <div id='createProductFormFile'>
              <input
                type="file"
                name='avatar'
                multiple
                accept='image/*'
                onChange={updateProductImagesChange}
              />
            </div>

            <div id="createProductFormImage">
              {
              oldimages && oldimages.map((image, index) => (
                  <img src={image.url} alt="Old Product Preview" key={index} />
                ))
              }
            </div>

            <div id="createProductFormImage">
              {
              imagesPreview && imagesPreview.map((image, index) => (
                  <img src={image} alt="Product Preview" key={index} />
                ))
              }
            </div>

            <Button
              id="createProductButton"
              type='submit'
              disabled={loading ? true : false}>Update</Button>
          </form>

        </div>
      </div>
    </Fragment>
    }
    </Fragment>
    
  )
}


export default UpdateProduct
