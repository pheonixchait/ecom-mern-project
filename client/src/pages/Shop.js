import React, { useState, useEffect } from 'react'
import { getProductByCounts, fetchProductsByFilter } from '../functions/product'
import { useSelector, useDispatch } from 'react-redux'
import ProductCard from '../components/Cards/ProductCard'
import { Menu, Slider, Checkbox, Radio } from 'antd'
import { DollarOutlined, DownSquareOutlined, StarOutlined } from '@ant-design/icons'
import { getCategories } from '../functions/category'
import { getSubs } from '../functions/sub'
import Star from "../components/forms/Star"

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState([0, 0]);
    const [ok, setOk] = useState(false); //state to decide whether to respond to slider or not when user plays with it
    const [categories, setCategories] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [subs, setSubs] = useState([]);
    const [sub, setSub] = useState('');
    const [star, setStar] = useState('');
    const [brands, setBrands] = useState(["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"]);
    const [brand, setBrand] = useState('');
    const [colors, setColors] = useState(["Black", "Brown", "Silver", "White", "Blue"]);
    const [color, setColor] = useState('');
    const [shipping, setShipping] = useState('');

    const { SubMenu } = Menu; //Destructured Menu
    const dispatch = useDispatch();

    let { search } = useSelector((state) => ({ ...state }));
    let { text } = search;

    //load products by default on page load
    const loadAllProducts = () => {
        getProductByCounts(12).then(p => {
            setProducts(p.data);
            setLoading(false);
        });
    }

    useEffect(() => {
        loadAllProducts();
        getCategories().then(res => setCategories(res.data));
        //console.log(categories);
        getSubs().then(res => setSubs(res.data));
        //console.log("subs", subs);
    }, [])

    //load products on user search input
    useEffect(() => {
        //console.log('serach text', text);
        const delayed = setTimeout(() => {
            if (text)
                fetchProducts({ query: text });
            else loadAllProducts();
        }, 300);
        return () => clearTimeout(delayed); //return in useeffect is used to run a function when components unmounts or before it re-renders

    }, [text])

    //load products on price change
    useEffect(() => {
        fetchProducts({ price });
    }, [ok])

    const fetchProducts = (arg) => {
        fetchProductsByFilter(arg)
            .then(res => {
                setProducts(res.data);
            })
    }

    const handleSlider = (value) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" } //to clear text in search bar
        })
        setCategoryIds([]);//to clear all the other states
        setStar("");
        setSub('');
        setBrand('');
        setColor('');
        setShipping('');
        setPrice(value);
        setTimeout(() => { //timeout to reduce the number of request sent to backend just bcuz user is playing with slider.
            setOk(!ok);
        }, 300)
    }

    //show categories in a list of checkboxes
    const showCategories = () => categories.map((c) => <div>
        <Checkbox key={c._id} onChange={handleCheck} className="pb-2 pl-4 pr-4" value={c._id} name="category" checked={categoryIds.includes(c._id)}>
            {c.name}
        </Checkbox>
        <br />
    </div>)

    const handleCheck = (e) => {
        //defaulting other filters and search
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" } //to clear text in search bar
        })
        setStar("");
        setSub('');
        setBrand('');
        setColor('');
        setShipping('');
        setPrice([0, 0]);
        //below is to handle the elements to be considered as checked
        let inTheState = [...categoryIds];
        let justChecked = e.target.value;
        let foundInTheState = inTheState.indexOf(justChecked);
        if (foundInTheState === -1) {
            inTheState.push(justChecked);
        } else {
            inTheState.splice(foundInTheState, 1);
        }
        setCategoryIds(inTheState);
        //console.log(inTheState);
        fetchProducts({ category: inTheState });
    }

    const showStars = () => (
        <div className="pr-4 pl-4 pb-2">
            <Star starClick={handleStarClick} numberOfStars={5} />
            <Star starClick={handleStarClick} numberOfStars={4} />
            <Star starClick={handleStarClick} numberOfStars={3} />
            <Star starClick={handleStarClick} numberOfStars={2} />
            <Star starClick={handleStarClick} numberOfStars={1} />
        </div>
    );
    //take care of which paranthesis you use while writing frontend code outside return

    const handleStarClick = (num) => {
        //console.log(num);
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" } //to clear text in search bar
        })
        setPrice([0, 0]);
        setCategoryIds([]);
        setSub('');
        setBrand('');
        setColor('');
        setShipping('');
        setStar(num);
        fetchProducts({ stars: num });
    }

    //show sub categories
    //in handleSubmit we used arrow funtion to make sure that it doesn't execute in that line itself instead it just references to that function, why? because we are passing parameters.
    const showSubs = () => subs.map((s) => <div key={s._id} onClick={() => handleSubmit(s)} className="p-1 m-1 badge badge-secondary" style={{ cursor: "pointer" }}>
        {s.name}
    </div>)

    const handleSubmit = (sub) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" } //to clear text in search bar
        })
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('');
        setBrand('');
        setColor('');
        setShipping('');
        setSub(sub);
        fetchProducts({ sub });
    }

    const showBrands = () => brands.map((b) =>
        <div>
            <Radio key={b} onChange={handleBrand} className="pb-1 pl-4 pr-4" value={b} name="b" checked={b === brand}>
                {b}
            </Radio>
            <br />
        </div >
    )

    const handleBrand = (e) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" } //to clear text in search bar
        })
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('');
        setSub('');
        setColor('');
        setShipping('');
        setBrand(e.target.value);
        fetchProducts({ brand: e.target.value });
    }

    const showColors = () => colors.map((c) =>
        <div>
            <Radio key={c} onChange={handleColor} className="pb-1 pl-4 pr-4" value={c} name="c" checked={c === color}>
                {c}
            </Radio>
            <br />
        </div >
    )

    const handleColor = (e) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" } //to clear text in search bar
        })
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('');
        setSub('');
        setBrand('');
        setShipping('');
        setColor(e.target.value);
        fetchProducts({ color: e.target.value });
    }

    const showshipping = () => (
        <>
            <Checkbox onChange={handleShipping} className="pb-2 pl-4 pr-4" value={'Yes'} name="Yes" checked={shipping === 'Yes'}>
                Yes
            </Checkbox>
            <br />
            <Checkbox onChange={handleShipping} className="pb-2 pl-4 pr-4" value={'No'} name="No" checked={shipping === 'No'}>
                No
            </Checkbox>
        </>
    )

    const handleShipping = (e) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" } //to clear text in search bar
        })
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('');
        setSub('');
        setBrand('');
        setColor('');
        setShipping(e.target.value);
        fetchProducts({ shipping: e.target.value });
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 pt-2">
                    <h4>Search/Filter</h4>
                    <hr />
                    <Menu defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7']} mode="inline">
                        {/* Price */}
                        <SubMenu key="1" title={<span className="h6"><DollarOutlined />Price</span>}>
                            <div>
                                <Slider
                                    className="ml-4 mr-4"
                                    tipFormatter={(v) => `$${v}`}
                                    range value={price}
                                    onChange={handleSlider}
                                    max="4999" />
                            </div>
                        </SubMenu>
                        {/* Category */}
                        <SubMenu key="2" title={<span className="h6"><DownSquareOutlined />Categories</span>}>
                            <div>
                                {/* Note the use of () in the fuction call to a function which has a part of this render code, the ()s in not used for handleslider*/}
                                {showCategories()}
                            </div>
                        </SubMenu>

                        {/* Star */}
                        <SubMenu key="3" title={<span className="h6"><StarOutlined />Rating</span>}>
                            <div>
                                {showStars()}
                            </div>
                        </SubMenu>

                        {/* Sub Category */}
                        <SubMenu key="4" title={<span className="h6"><DownSquareOutlined />Sub - Categories</span>}>
                            <div className="pl-4 pr-4">
                                {showSubs()}
                            </div>
                        </SubMenu>

                        {/* Brands */}
                        <SubMenu key="5" title={<span className="h6"><DownSquareOutlined />Brands</span>}>
                            <div className="pr-4">
                                {showBrands()}
                            </div>
                        </SubMenu>

                        {/* Color */}
                        <SubMenu key="6" title={<span className="h6"><DownSquareOutlined />Colors</span>}>
                            <div className="pr-4">
                                {showColors()}
                            </div>
                        </SubMenu>

                        {/* shipping */}
                        <SubMenu key="7" title={<span className="h6"><DownSquareOutlined />Shipping</span>}>
                            <div className="pr-4">
                                {showshipping()}
                            </div>
                        </SubMenu>

                    </Menu>
                </div>
                <div className="col-md-9 pt-2">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4>Products</h4>
                    )}

                    {products.length < 1 && <p>No products found</p>}

                    <div className="row pb-5">
                        {
                            products.map((p) => (
                                <div key={p._id} className="col-md-4 mt-3">
                                    <ProductCard product={p} />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shop