import React from 'react'
import Resizer from 'react-image-file-resizer'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Avatar, Badge } from 'antd'

const FileUpload = ({ values, setValues, setLoading }) => {

    const { user } = useSelector((state) => ({ ...state }))

    const fileUploadAndResize = (e) => {
        //console.log(e.target.files)
        let files = e.target.files
        let allUploadedFiles = values.images // to add new files to already filled list
        if (files) {
            setLoading(true)
            for (let i = 0; i < files.length; i++) {
                Resizer.imageFileResizer(
                    files[i], //check this package's docs to know these parameters
                    720,
                    720,
                    "JPEG",
                    100,
                    0,
                    (uri) => {
                        //console.log(uri)
                        axios.post(
                            `${process.env.REACT_APP_API}/uploadimages`,
                            { image: uri },
                            {
                                headers: {
                                    authToken: user ? user.token : "",
                                },
                            }
                        )
                            .then(res => {
                                console.log('IMAGE UPLOAD RES DATA', res)
                                setLoading(false)
                                allUploadedFiles.push(res.data)
                                setValues({ ...values, images: allUploadedFiles })

                            })
                            .catch(err => {
                                console.log('IMAGE UPLOAD ERR DATA', err)
                                setLoading(false)
                            })
                    },
                    "base64"
                )
            }
        }
    }

    const handleImageRemove = (public_id) => {
        setLoading(true)
        axios.post(
            `${process.env.REACT_APP_API}/removeimage`,
            { public_id },
            {
                headers: {
                    authToken: user ? user.token : "",
                },
            }
        )
            .then((res) => {
                setLoading(false)
                const { images } = values
                let filteredImages = images.filter((item) => {
                    return item.public_id !== public_id
                })
                setValues({ ...values, images: filteredImages })
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    return (
        <>
            <div className="row">
                {
                    values.images && values.images.map((image) => (
                        <Badge count="X" key={image.public_id} onClick={() => handleImageRemove(image.public_id)} style={{ cursor: "pointer" }}>
                            < Avatar
                                src={image.url}
                                size={100}
                                className="ml-3"
                                shape="square"
                            />
                        </Badge>
                    ))
                }
            </div>

            <div className="row">
                < label className="btn btn-primary btn-raised mt-3" >
                    Choose File
                    < input type="file" hidden multiple accept="image/*" onChange={fileUploadAndResize} ></input>
                </label>

            </div >
        </>
    )
}

export default FileUpload