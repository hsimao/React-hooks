import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import Context from "./context";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { state } = useContext(Context);

  // 判斷當前是否有登入, 沒有的話導到 login 頁面
  return (
    <Route
      render={props =>
        !state.isAuth ? <Redirect to="/login" /> : <Component {...props} />
      }
      {...rest}
    />
  );
};

export default ProtectedRoute;
