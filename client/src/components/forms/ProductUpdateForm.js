import React from 'react'
import { Select } from 'antd'
const { Option } = Select

const ProductUpdateForm = ({
    handleSubmit,
    handleChange,
    setValues,
    values,
    handleCategoryChange,
    categories,
    subOptions,
    arrayOfSubIds,
    setArrayOfSubIds,
    selectedCategory
}) => {

    //destructure here
    const { title, description, price, category, subs, shipping, quantity, images, colors, brands, color, brand } = values

    return (<form onSubmit={handleSubmit}>
        <div className="form-group">
            <label>
                Title
                            </label>
            <input className="form-control" type="text" name="title" value={title} onChange={handleChange} />
        </div>

        <div className="form-group">
            <label>
                Description
                            </label>
            <input className="form-control" type="text" name="description" value={description} onChange={handleChange} />
        </div>

        <div className="form-group">
            <label>
                Price
                            </label>
            <input className="form-control" type="number" name="price" value={price} onChange={handleChange} />
        </div>

        <div className="form-group">
            <label>
                Shipping
            </label>
            <select
                className="form-control"
                name="shipping"
                onChange={handleChange}
                value={shipping}
            >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
            </select>
        </div>

        <div className="form-group">
            <label>
                Quantity
                            </label>
            <input className="form-control" type="number" name="quantity" value={quantity} onChange={handleChange} />
        </div>

        <div className="form-group">
            <label>
                Color
            </label>
            <select value={color} className="form-control" name="color" onChange={handleChange}>
                <option>Please Select</option>
                {colors.map((c) => (<option value={c}>{c}</option>))}
            </select>
        </div>

        <div className="form-group">
            <label>
                Brand
                            </label>
            <select value={brand} className="form-control" name="brand" onChange={handleChange}>
                <option>Please Select</option>
                {brands.map((b) => (<option value={b}>{b}</option>))}
            </select>
        </div>

        <div className="form-group">
            <label>Category</label>
            <select
                name="category"
                className="form-control"
                onChange={handleCategoryChange}
                value={selectedCategory ? selectedCategory : category._id}
            >
                <option>Please Select</option>
                {categories.length > 0 && categories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
            </select>
        </div>

        <div className="form-group">
            <label>Sub Categories</label>
            <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Please Select"
                value={arrayOfSubIds}
                onChange={(value) => setArrayOfSubIds(value)}
            >
                {subOptions.length > 0 && subOptions.map((s) => (<Option key={s._id} value={s._id}>{s.name}</Option>))}
            </Select>
        </div>

        <br />
        <button className="btn btn-outline-info">Save</button>
    </form>
    )
}

export default ProductUpdateForm