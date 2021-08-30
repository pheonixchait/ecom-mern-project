import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import RegisterComplete from "./pages/auth/RegisterComplete";
import Login from "./pages/auth/Login";
import Header from "./components/nav/Header";
import ForgotPassword from "./pages/auth/ForgotPassword";
import 'antd/dist/antd.css' //imported css in top level

import History from "./pages/user/History"
import Password from "./pages/user/Password"
import Wishlist from "./pages/user/Wishlist"
import AdminDashboard from "./pages/admin/AdminDashboard"
import CategoryCreate from "./pages/admin/category/CategoryCreate"
import CategoryUpdate from "./pages/admin/category/CategoryUpdate"
import SubCreate from "./pages/admin/sub/SubCreate"
import SubUpdate from "./pages/admin/sub/SubUpdate"
import ProductCreate from "./pages/admin/product/ProductCreate"
import AllProducts from "./pages/admin/product/AllProducts"
import ProductUpdate from "./pages/admin/product/ProductUpdate"
import Product from "../src/pages/Product"
import CategoryHome from "../src/pages/category/CategoryHome"
import SubHome from "../src/pages/sub/SubHome"

import UserRoute from "./components/routes/UserRoute"
import AdminRoute from "./components/routes/AdminRoute"

import CreateCouponPage from "./pages/admin/coupon/CreateCouponPage";

import Payment from "./pages/Payment";

import { auth } from './firebase';
import { useDispatch } from 'react-redux';

import { currentUser } from './functions/auth'

import Shop from './pages/Shop'

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import SideDrawer from "./components/drawer/SideDrawer";

/* function App() {
  return (
    <div>
      <p>React app</p>
    </div>
  );
} */

/* const App = () => (
  <div>
    <p>React app arrow func. Since only one element is returned we removed curly braces and return statement</p>
  </div>
); */

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (user) => {
        if (user) {
          const idTokenResult = await user.getIdTokenResult();
          currentUser(idTokenResult.token)
            .then((res) => {
              dispatch({
                type: "LOGGED_IN_USER",
                payload: {
                  name: res.data.name,
                  email: res.data.email,
                  token: idTokenResult.token,
                  role: res.data.role,
                  _id: res.data._id,
                }
              });
            })
            .catch(err => console.log(err))
        }
      }
    )// stored in variable so that we can return it later when state is dispatched to redux, this is done in order to avoid memory leaks
    return () => unsubscribe();
  }) // have removed [] because it was asking to include dispatch

  return (
    <>
      <Header />
      <SideDrawer />
      < ToastContainer />
      <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/register" component={Register}></Route>
        <Route exact path="/register/complete" component={RegisterComplete}></Route>
        <Route exact path="/forgot/password" component={ForgotPassword}></Route>
        <UserRoute exact path="/user/history" component={History}></UserRoute>
        <UserRoute exact path="/user/password" component={Password}></UserRoute>
        <UserRoute exact path="/user/wishlist" component={Wishlist}></UserRoute>
        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard}></AdminRoute>
        <AdminRoute exact path="/admin/category" component={CategoryCreate}></AdminRoute>
        <AdminRoute exact path="/admin/category/:slug" component={CategoryUpdate}></AdminRoute>
        <AdminRoute exact path="/admin/sub" component={SubCreate}></AdminRoute>
        <AdminRoute exact path="/admin/sub/:slug" component={SubUpdate}></AdminRoute>
        <AdminRoute exact path="/admin/product" component={ProductCreate}></AdminRoute>
        <AdminRoute exact path="/admin/products" component={AllProducts}></AdminRoute>
        <AdminRoute exact path="/admin/product/:slug" component={ProductUpdate}></AdminRoute>
        <Route exact path="/product/:slug" component={Product}></Route>
        <Route exact path="/category/:slug" component={CategoryHome}></Route>
        <Route exact path="/sub/:slug" component={SubHome}></Route>
        <Route exact path="/shop" component={Shop}></Route>
        <Route exact path="/cart" component={Cart}></Route>
        <Route exact path="/checkout" component={Checkout}></Route>
        <AdminRoute exact path="/admin/coupon" component={CreateCouponPage}></AdminRoute>
        <Route exact path="/payment" component={Payment}></Route>
      </Switch>
    </>
  );
}


export default App;
