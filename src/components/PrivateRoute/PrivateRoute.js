import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute({ element: Element, ...rest }) {
  const user = useSelector((state) => state.user.user);

  return user && Object.keys(user).length > 0 ? <Element {...rest} /> : <Navigate to="/login" />;
}

export default PrivateRoute;
