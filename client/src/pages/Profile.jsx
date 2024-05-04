import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage'
import { app } from '../firebase'

const Profile = () => {
    const fileref = useRef(null)
    const { currentUser } = useSelector(state => state.user)
    const [file, setFile] = useState('')
    const [filePer, setFilePer] = useState(0)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [formData, setFormData] = useState({})
    // let url = URL.createObjectURL(file)
    // var binaryData = [];
    // binaryData.push(file);
    // console.log("bin---", binaryData)
    // let url = window.URL.createObjectURL(new Blob(binaryData, { type: "application/zip" }))
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

    return (
        <div className='p-2 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form className='flex flex-col gap-4'>
                <input type='file' onChange={(e) => setFile(e.target.files[0])} ref={fileref} accept='image/*' hidden />
                {/* <img src={url || ''} /> */}
                <img onClick={() => fileref.current.click()} className='rounded-full object-cover h-24 w-24 cursor-pointer self-center mt-2 ' src={formData.avatar || currentUser.avatar} alt='Profile' />
                <p className='text-small self-center'>
                    {fileUploadError ? <span className='text-red-700 '>Error in Upload file (image must be less than 2 MB)</span> : 0 < filePer && filePer < 100 ? <span>{filePer} % done</span> : <span className='text-green-700'>Image uploaded successfully!</span>}
                </p>
                <input type='text' placeholder='username' value={currentUser.username} id='username' className='border  p-3 rounded-lg ' />
                <input type='email' placeholder='email' value={currentUser.email} id="email" className='border  p-3 rounded-lg ' />
                <input type='password' placeholder='password' value={''} id='password' className='border  p-3 rounded-lg ' />
                <button className='bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-80' >Upadate</button>
                <imput />
            </form>
            <div className='flex justify-between mt-2'>
                <span className='text-red-700 cursor-pointer'>Delete Account</span>
                <span className='text-red-700 cursor-pointer'>Sign out</span>
            </div>

        </div>
    )
}

export default Profile