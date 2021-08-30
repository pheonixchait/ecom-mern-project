import React from 'react'

const CategoryForm = ({ handleSubmit, name, setName }) => (
    <form onSubmit={handleSubmit}>
        {/* here don't do the mistake of using parenthesis after function call, I spent 10 mins debugging */}
        <div className="form-group">
            <label>Name</label>

            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} autoFocus required />
            <br />
            <button className="btn btn-outline-primary">Save</button>
        </div>
    </form>
)

export default CategoryForm