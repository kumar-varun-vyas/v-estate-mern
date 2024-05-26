import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage'
import { app } from '../firebase'
import {
    updateUserStart, updateUserFailuer, updateUserSuccess, deleteUserFailuer, deleteUserStart, deleteUserSuccess,
    signoutStart,
    signoutSuccess,
    signoutFailuer
} from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
const Profile = () => {
    const fileref = useRef(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { currentUser, error, loading } = useSelector(state => state.user)
    const [file, setFile] = useState('')
    const [filePer, setFilePer] = useState(0)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [formData, setFormData] = useState({})

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
                <imput />
            </form>
            <div className='flex justify-between mt-2'>
                <span className='text-red-700 cursor-pointer' onClick={deleteUser}>Delete Account</span>
                <span className='text-red-700 cursor-pointer' onClick={signout}>Sign out</span>
            </div>
            {error && <span className='text-red-700 '>{`${error}`}</span>}
        </div>

    )
}

export default Profile