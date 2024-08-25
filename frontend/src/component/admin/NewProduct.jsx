import React, { Fragment, useState, useEffect } from 'react';
import "./NewProduct.css";
import { useSelector, useDispatch } from 'react-redux';
import { createProduct, clearErrors } from '../../actions/productaction';
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
import { useNavigate } from 'react-router-dom';
import { NEW_PRODUCT_RESET } from '../../constatnce/productConstant';


const NewProduct = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.newProduct)
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
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
    if(error) {
      alert.error(error);
      dispatch(clearErrors())
    }
    if(success) {
      alert.success("Product Created Successfully");
      navigate("/admin/dashboard");
      dispatch({ type: NEW_PRODUCT_RESET })
    }
  }, [dispatch, alert, error, success, navigate]);

  const createProductSubmitHandler = (e) => {
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
    dispatch(createProduct(myForm))
  }

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);

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
      <Metadata title="Create Product - Admin" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">

          <form
            className='createProductForm'
            encType='multipart/form-data'
            onSubmit={createProductSubmitHandler}
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
              <select onChange={(e) => setCategory(e.target.value)}>
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
                onChange={createProductImagesChange}
              />
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
              disabled={loading ? true : false}>Create</Button>
          </form>

        </div>
      </div>
    </Fragment>
    }
    </Fragment>
    
  )
}

export default NewProduct
