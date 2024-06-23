import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useState } from 'react'
import { app } from '../firebase'
import userSlice from '../redux/user/userSlice'

export default function CreateListing() {
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],

    })
    const [uploading, setUploading] = useState(false)
    const [imageUploadError, setImageUploadError] = useState('')
    const handleImageUpload = () => {

        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = []
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))

            }

            Promise.all(promises).then((urls) => {
                setFormData({ ...FormData, imageUrls: formData.imageUrls.concat(urls) })
                setImageUploadError(false)
                setUploading(false)
            }).catch((err) => {
                console.log("image uploading error", err);
                setImageUploadError(" uploading failed")
            })


        } else {
            setUploading(false)
            setImageUploadError('Maximum 6 images can be uploaded')
        }
    }

    const storeImage = async (file) => {
        console.log("uploading call");

        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        {
                            resolve(downloadUrl)
                        }
                    })
                }

            )
        })


    }

    const handleDeleteImage = (imageIndex) => {
        const arr = formData.imageUrls
        setFormData({ ...formData, imageUrls: formData.imageUrls.filter((url, i) => i !== imageIndex) })


    }
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
                CreateListing
            </h1>
            <form className='flex flex-col gap-4 sm:flex-row '>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type="text" placeholder='Name' className='border p-2 rounded-lg' id='name' maxLength='62' minLength='10' required />
                    <textarea type="text" placeholder='Description' className='border p-2 rounded-lg' id='description' required />
                    <input type="text" placeholder='Adderess' className='border p-2 rounded-lg' id='adderess' required />
                    <div className='flex flex-row gap-6 flex-wrap'>
                        <div className='flex gap-2' >
                            <input type="checkbox" id="sell" className='w-4 ' />
                            <span className=''>Sell</span>
                        </div>
                        <div className='flex gap-2' >
                            <input type="checkbox" id="rent" className='w-4' />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2' >
                            <input type="checkbox" id="parkingSpot" className='w-4' />
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2' >
                            <input type="checkbox" id="furnished" className='w-4 ' />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2' >
                            <input type="checkbox" id="offer" className='w-4 ' />
                            <span>Offer</span>
                        </div>

                    </div>
                    <div className='flex gap-6'>
                        <div className=' flex gap-2 items-center '>
                            <input type="number" id="beds" className='w-20 border border-gray-300 rounded-lg p-2' />
                            <p>Beds</p>
                        </div>
                        <div className=' flex gap-2 items-center '>
                            <input type="number" id="bath" className='w-20 border border-gray-300 rounded-lg p-2' />
                            <p>Bath</p>
                        </div>

                    </div>
                    <div>
                        <div className=' flex gap-2 items-center '>
                            <input type="number" id="RegularPirce" className='w-40 border border-gray-300 rounded-lg p-2' />
                            <div>
                                <p>Regular Price</p>
                                <span className='text-xs'>($ / Month)</span>
                            </div>

                        </div>
                    </div>
                    <div>
                        <div className=' flex gap-2 items-center '>
                            <input type="number" id="discountedPirce" className='w-40 border border-gray-300 rounded-lg p-2' />
                            <div>
                                <p>Discount Price</p>
                                <span className='text-xs'>($ / Month)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=' flex flex-col gap-4 flex-1'>
                    <p> <b>Images:</b>  The first image will be cover (max 6)</p>
                    <form className='flex items-center gap-2 '>

                        <input onChange={e => setFiles(e.target.files)} type='file' accept='image/*' multiple className='p-2 border border-gray-300 rounded w-full' />
                        <button type='button' onClick={handleImageUpload} className='border border-green-500 text-green-700 uppercase p-2.5 rounded hover:shadow-lg'> {uploading ? "uploading..." : "Upload"}</button>

                    </form>
                    <p className='text-red-700'>{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 &&

                        formData.imageUrls.map((url, i) => (
                            < div key={url} className='flex justify-between border p-2 items-center '>
                                <img src={url} alt="listing img" className='w-20 h-20 object-cover rounded-lg' />
                                <button type='button' onClick={() => handleDeleteImage(i)} className='p-2 border border-red-300 h-10 text-red-500 rounded-lg hover:text-red-700 hover:shadow-lg'>Delete</button>
                            </div>
                        ))




                    }

                    <button className='bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-80 item-center text-center' to={"/create-listing"}>
                        Create Listing
                    </button>

                </div>
            </form>
        </main>
    )
}
