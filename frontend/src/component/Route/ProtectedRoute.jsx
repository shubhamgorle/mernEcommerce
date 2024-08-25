import React from "react";
import { useSelector } from "react-redux";
import { Navigate} from "react-router-dom";

const ProtectedRoute = ({ isAdmin, element: Component, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if(loading === false){
    if(isAuthenticated === false) {
      return <Navigate to="/login" />;
    }
    if(isAdmin === true && user.role !== "admin") {
      return <Navigate to="/login" />;
    }
    return <Component {...rest} />;
  }

 
};

export default ProtectedRoute;
