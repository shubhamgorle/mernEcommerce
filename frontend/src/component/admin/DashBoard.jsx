import React, {useEffect}from 'react'
import "./DashBoard.css"
import SideBar from './SideBar.jsx'
import { useSelector, useDispatch } from 'react-redux';
import { getAdminProducts } from '../../actions/productaction';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { getAllOrders } from '../../actions/orderAction.js';
import { getAllUsers } from '../../actions/userActions.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const DashBoard = () => {
  const dispatch = useDispatch();
  const { products} = useSelector((state)=>state.products);
  const { orders} = useSelector((state)=>state.allOrders);
  const { users } = useSelector((state)=>state.allUsers)


   var outOfStock = 0;
   products && 
   products.forEach(item => {
      if(item.stock === 0){
        outOfStock = outOfStock + 1
      }
   });
  useEffect(()=>{
      dispatch(getAdminProducts())
      dispatch(getAllOrders())
      dispatch(getAllUsers())
  },[dispatch])

  let totalAmount = 0;
 orders && orders.forEach((item)=>{
  totalAmount += item.totalPrice
 })
  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197,72,49"],
        data: [0, totalAmount]
      }
    ],
  }
  const doughnutState = {
    labels: ["Out of Stock", "Instock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products.length-outOfStock]
      }
    ],
  }

  return (
    <div className="dashboard">
      <SideBar />
      <div className="dashboardContainer">
        <Typography component='h1'>Dashboard</Typography>

        <div className="dashboardSummary">
          <div>
            <p>
              Total Amount <br /> <span>&#8377;{totalAmount.toFixed(2)}</span>
            </p>
          </div>

          <div className="dashboardSummaryBox2">
            <Link to='/admin/products'>
              <p>Products</p>
              <p>{products.length}</p>
            </Link>

            <Link to='/admin/orders'>
              <p>Orders</p>
              <p>{orders && orders.length}</p>
            </Link>

            <Link to='/admin/users'>
              <p>Users</p>
              <p>{users.length}</p>
            </Link>
          </div>
        </div>

        <div className="lineChart">
          <Line data={lineState} />
        </div>

        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>

      </div>
    </div>
  )
}

export default DashBoard
