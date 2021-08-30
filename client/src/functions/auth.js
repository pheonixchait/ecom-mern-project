import axios from 'axios'

export const createOrUpdateUser = async (authToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/create-or-update-user`,
        {}, //body
        {
            headers: {
                authToken, //when key and value are same you need not write authToken : authToken
            },
        }
    )
}

export const currentUser = async (authToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/current-user`,
        {}, //body
        {
            headers: {
                authToken, //when key and value are same you need not write authToken : authToken
            },
        }
    )
}

export const currentAdmin = async (authToken) => {
    return await axios.post(
        `${process.env.REACT_APP_API}/current-admin`,
        {}, //body
        {
            headers: {
                authToken, //when key and value are same you need not write authToken : authToken
            },
        }
    )
}