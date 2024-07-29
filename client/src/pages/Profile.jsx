import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getStorage, uploadBytesResumable, ref, getDownloadURL, list } from 'firebase/storage'
import { app } from '../firebase'
import {
    updateUserStart, updateUserFailuer, updateUserSuccess, deleteUserFailuer, deleteUserStart, deleteUserSuccess,
    signoutStart,
    signoutSuccess,
    signoutFailuer
} from '../redux/user/userSlice'
import { Link, useNavigate } from 'react-router-dom'
const Profile = () => {
    const fileref = useRef(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { currentUser, error, loading } = useSelector(state => state.user)
    const [file, setFile] = useState('')
    const [filePer, setFilePer] = useState(0)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [formData, setFormData] = useState({})
    const [showListingError, setShowListingError] = useState(false)
    const [listing, setListing] = useState([])

    useEffect(() => {
        if (file) {
            handleFileUpload(file)
        }
    }, [file])


    const handleFileUpload = () => {
        const storage = getStorage(app)
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on('state_changed',
            (snapshot) => {
                setFilePer(Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
            },

            (error) => {
                setFileUploadError(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setFormData({ ...formData, avatar: url })
                })
            }
        )
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }
    const handleUpdateUser = async (e) => {
        e.preventDefault()
        try {
            dispatch(updateUserStart())
            const res = await fetch(`api/user/updateUser/${currentUser._id}`,
                {
                    method: "POST",
                    headers: { 'content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                }
            )
            const data = await res.json()

            if (data.success == false) {
                console.log(data)
                dispatch(updateUserFailuer(data.message))
                return
            }
            dispatch(updateUserSuccess(data.data))
        } catch (err) {

            dispatch(updateUserFailuer(err))
        }
    }

    const deleteUser = async () => {
        try {
            dispatch(deleteUserStart)

            const res = await fetch(`api/user/delete/${currentUser._id}`,
                {
                    method: "DELETE",
                    headers: { 'content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                }
            )
            const data = await res.json()
            if (data.success == false) {
                console.log(data)
                dispatch(deleteUserFailuer(data.message ? data.message : ''))
                return
            } else {
                dispatch(deleteUserSuccess(data.data))
                navigate('/sign-in')
            }
        } catch (err) {
            dispatch(deleteUserFailuer(err ? err : ''))
        }

    }
    const signout = async () => {
        try {
            dispatch(signoutStart)
            const res = await fetch(`api/user/signout`)
            const data = await res.json()
            if (data.success == false) {
                console.log(data)

                return
            } else {
                localStorage.clear()
                dispatch(signoutSuccess)
                navigate('/sign-in')
            }
        } catch (err) {
            console.log(error)
            dispatch(signoutFailuer(err ? err : ''))
        }

    }
    const handleShowLising = async () => {
        try {
            const res = await fetch(`api/user/listing/${currentUser._id}`)
            const data = await res.json()
            console.log(data)
            if (data.success == false) {
                console.log(data)
                return
            } else {
                setListing(data.data)
            }
        } catch (err) {
            setShowListingError(err.message)

        }

    }

    const handleListingDelete = async (id) => {
        try {
            const res = await fetch(`api/listing/delete/${id}`, {
                method: "DELETE",
                headers: { 'content-Type': 'application/json' },
            })
            const data = await res.json()

            if (data.success == false) {
                console.log(data)
                return
            } else {
                setListing((prev) =>
                    prev.filter(list => list._id !== id))
                // handleShowLising()
            }

        } catch (err) { console.log(err) }
    }

    return (
        <div className='p-2 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form onSubmit={handleUpdateUser} className='flex flex-col gap-4'>
                <input type='file' onChange={(e) => setFile(e.target.files[0])} ref={fileref} accept='image/*' hidden />
                {/* <img src={url || ''} /> */}
                <img onClick={() => fileref.current.click()} className='rounded-full object-cover h-24 w-24 cursor-pointer self-center mt-2 ' src={formData.avatar || currentUser.avatar} alt='Profile' />
                <p className='text-small self-center'>
                    {fileUploadError ? <span className='text-red-700 '>Error in Upload file (image must be less than 2 MB)</span> : 0 < filePer && filePer < 100 ? <span>{filePer} % done</span> : filePer == 100 ? <span className='text-green-700'>Image uploaded successfully!</span> : ''}
                </p>
                <input type='text' onChange={handleChange} placeholder='username' defaultValue={currentUser.username} id='username' className='border  p-3 rounded-lg ' />
                <input type='email' onChange={handleChange} placeholder='email' defaultValue={currentUser.email} id="email" className='border  p-3 rounded-lg ' />
                <input type='password' onChange={handleChange} placeholder='password' defaultValue={''} id='password' className='border  p-3 rounded-lg ' />
                <button className='bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-80 ' disabled={loading ? true : false} type='submit' > {loading ? 'Loading...' : "Upadate"}</button>
                <Link className='bg-green-700 text-white p-3 uppercase rounded-lg hover:opacity-80 item-center text-center' to={"/create-listing"}>
                    Create Listing
                </Link>
                <imput />
            </form>
            <div className='flex justify-between mt-2'>
                <span className='text-red-700 cursor-pointer' onClick={deleteUser}>Delete Account</span>
                <span className='text-red-700 cursor-pointer' onClick={signout}>Sign out</span>
            </div>
            {error && <span className='text-red-700 '>{`${error}`}</span>}
            <div>
                <button onClick={handleShowLising} className='text-green-700 mt-5 items-center '>Show Listing</button>
                {showListingError && <p className='text-red-700 '>{`${showListingError}`}</p>}

                {listing && (
                    <div className='flex flex-col gap-4'>
                        <h1 className='text-center my-5 text-xl font-semibold'>Your Listings</h1>
                        {listing.map((list) => (
                            // console.log(list)

                            <div id={list._id}
                                className=' border rounded-lg p-3 flex justify-between items-center gap-4'
                            >

                                <Link to={`/listing/${list._id}`}>
                                    <img className='w-16 h-16 object-contain' src={list.imageUrls[0]} />


                                </Link>
                                <Link to={`/listing/${list._id}`} className=' text-slate-700 font-semibold hover:underline truncate flex-1'>
                                    <p className=''>{list.name}</p>
                                </Link>

                                <div className='flex flex-col items-center'>
                                    <button onClick={() => handleListingDelete(list._id)} className='text-red-700 uppercase'>Delete</button>
                                    <Link to={`/update-listing/${list._id}`}><button className='text-green-700 uppercase'>Edit</button></Link>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

    )
}

export default Profile