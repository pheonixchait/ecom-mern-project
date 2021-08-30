import React, { useState } from "react";
import { Menu, Badge } from 'antd';
import { AppstoreOutlined, SettingOutlined, UserOutlined, UserAddOutlined, LogoutOutlined, ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { useDispatch, useSelector } from "react-redux";

import { useHistory } from "react-router-dom"; //here useHistory is used instead of history like we used in registerComplete because history can be used only in those components which are included in route link in app.js
import Item from "antd/lib/list/Item";

import Search from "../forms/Search";

const { SubMenu } = Menu; //destructuring tags to avoid writing . operator, same can be applied to item tag

const Header = () => {
    const [current, setCurrent] = useState('home');
    let dispatch = useDispatch();
    let { user, cart } = useSelector((state) => ({ ...state }));
    let history = useHistory();

    const handleClick = (e) => {
        setCurrent(e.key);
    };

    const logout = () => {
        firebase.auth().signOut();
        dispatch({
            type: "LOGGED_OUT",
            payload: null,
        });
        history.push('/login');
    }

    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
            <Menu.Item key="home" icon={<AppstoreOutlined />}>
                <Link to="/">Home</Link>
            </Menu.Item>

            <Menu.Item key="shop" icon={<ShoppingOutlined />}>
                <Link to="/shop">Shop</Link>
            </Menu.Item>

            <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
                <Link to="/cart">
                    <Badge count={cart.length} offset={[9, 0]}>
                        Cart
                    </Badge>
                </Link>
            </Menu.Item>

            {!user && (
                <>
                    <Menu.Item key="register" icon={<UserAddOutlined />} className="float-right">

                        <Link to="/register">Register</Link>
                    </Menu.Item>

                    <Menu.Item key="login" icon={<UserOutlined />} className="float-right">

                        <Link to="/login">Login</Link>
                    </Menu.Item>
                </>
            )}


            {user && (
                <SubMenu
                    key="SubMenu"
                    icon={<SettingOutlined />}
                    title={user.email && user.email.split('@')[0]}
                    className="float-right"
                >

                    {user && user.role === "subscriber" && (
                        <Menu.Item>
                            <Link to="/user/history">Dashboard</Link>
                        </Menu.Item>
                    )}

                    {user && user.role === "admin" && (
                        <Menu.Item>
                            <Link to="/admin/dashboard">Dashboard</Link>
                        </Menu.Item>
                    )}

                    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>Logout</Menu.Item>
                </SubMenu>
            )}
            <span className="float-right p-1">
                <Search />
            </span>
        </Menu>
    )
}

export default Header;