import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { app } from '../firebase'
import userSlice from '../redux/user/userSlice'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

export default function UpdateListing() {
    const currentUser = useSelector(state => state.user.currentUser)
    const { listingId } = useParams('id')
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'sale',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: '0',
        offer: false,
        parking: false,
        furnished: false,
        pets: false

    })
    const [uploading, setUploading] = useState(false)
    const [imageUploadError, setImageUploadError] = useState('')
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [succesMessage, setSuccessMessage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchListing = async () => {
            let res = await fetch(`/api/listing/get/${listingId}`)
            let data = await res.json()
            if (data.success === false) {
                console.log("get single listing====", data.message)
                return
            }
            setFormData(data.data)
        }
        fetchListing()
    }, [])

    const handleImageUpload = () => {

        if (files.length > 0 && files.length + formData?.imageUrls?.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = []
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))

            }

            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData?.imageUrls?.concat(urls) })
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

    const handleChange = (e) => {
        setError(false)
        if (e.target.name == 'sale' || e.target.name == 'rent') {
            setFormData({
                ...formData,
                type: e.target.name
            })

        }
        if (e.target.name == 'parking' || e.target.name == 'furnished' || e.target.name == 'offer' || e.target.name == 'pets') {
            setFormData({
                ...formData,
                [e.target.name]: e.target.checked
            })
        }

        if (e.target.type == 'text' || e.target.type == 'number' || e.target.type == 'textarea') {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            })
        }


    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData?.imageUrls?.length < 1) {
            return setError('You must upload at least one image. ')
        }
        if (+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price ')
        if (formData.type == '') return setError("Plese select 'Sale' or 'Rent'. ")
        try {
            setError(false)
            setLoading(false)

            const res = await fetch(`/api/listing/update/${listingId}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData, userRef: currentUser._id
                })
            })
            const data = await res.json()
            setLoading(false)
            if (data.success == false) {
                setError(data.message)
            }
            setSuccessMessage(data.message)
            // navigate('/listing/' + data._id)

        } catch (error) {
            setError(error.message)
            setLoading(true)
        }
    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
                Update Listing
            </h1>
            <form type='submit' onSubmit={handleSubmit} className='flex flex-col gap-4 sm:flex-row '>
                <div className='flex flex-col gap-4 flex-1'>
                    <input
                        type="text"
                        placeholder='Name'
                        className='border p-2 rounded-lg'
                        id='name'
                        maxLength='62'
                        minLength='10'
                        required
                        onChange={handleChange}
                        value={formData.name}
                        name='name'
                    />
                    <textarea
                        type="text"
                        placeholder='Description'
                        className='border p-2 rounded-lg'
                        id='description'
                        required
                        onChange={handleChange}
                        value={formData.description}
                        name='description'
                    />
                    <input
                        type="text"
                        placeholder='Address'
                        className='border p-2 rounded-lg'
                        id='address'
                        required
                        onChange={handleChange}
                        value={formData.address}
                        name='address'
                    />

                    <div className='flex flex-row gap-6 flex-wrap'>
                        <div className='flex gap-2' >
                            <input
                                type="checkbox"
                                id="sale"
                                className='w-4 '
                                onChange={handleChange}
                                checked={formData.type == 'sale'}
                                name='sale'
                            />
                            <span className=''>Sale</span>
                        </div>
                        <div className='flex gap-2' >
                            <input
                                type="checkbox"
                                id="rent"
                                className='w-4'
                                onChange={handleChange}
                                checked={formData.type == 'rent'}
                                name='rent'
                            />
                            <span>Rent</span>
                        </div>
                    </div>
                    <div className='flex flex-row gap-6 flex-wrap'>
                        <div className='flex gap-2' >
                            <input
                                type="checkbox"
                                id="parkingSpot"
                                className='w-4'
                                onChange={handleChange}
                                checked={formData.parking}
                                name='parking'
                            />
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2' >
                            <input
                                type="checkbox"
                                id="furnished"
                                className='w-4 '
                                onChange={handleChange}
                                checked={formData.furnished}
                                name='furnished'
                            />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2' >
                            <input
                                type="checkbox"
                                id="pets"
                                className='w-4 '
                                onChange={handleChange}
                                checked={formData.pets}
                                name='pets'
                            />

                            <span>Pets</span>
                        </div>
                        <div className='flex gap-2' >
                            <input
                                type="checkbox"
                                id="offer"
                                className='w-4 '
                                onChange={handleChange}
                                checked={formData.offer}
                                name='offer'
                            />

                            <span>Offer</span>
                        </div>


                    </div>
                    <div className='flex gap-6'>
                        <div className=' flex gap-2 items-center '>
                            <input
                                type="number"
                                id="beds"
                                className='w-20 border border-gray-300 rounded-lg p-2'
                                onChange={handleChange}
                                value={formData.bedrooms}
                                name='bedrooms'
                            />

                            <p>Beds</p>
                        </div>
                        <div className=' flex gap-2 items-center '>
                            <input
                                type="number"
                                id="bath"
                                className='w-20 border border-gray-300 rounded-lg p-2'
                                onChange={handleChange}
                                value={formData.bathrooms}
                                name='bathrooms'
                            />
                            <p>Bath</p>
                        </div>

                    </div>
                    <div>
                        <div className=' flex gap-2 items-center '>
                            <input
                                type="number"
                                id="RegularPirce"
                                className='w-40 border border-gray-300 rounded-lg p-2'
                                onChange={handleChange}
                                value={formData.regularPrice}
                                name='regularPrice'
                                min='50'
                                max='1000'
                            />

                            <div>
                                <p>Regular Price</p>
                                {formData.type !== 'sale' && <span className='text-xs'>($ / Month)</span>}
                            </div>

                        </div>
                    </div>
                    {formData.offer &&
                        <div>
                            <div className=' flex gap-2 items-center '>
                                <input
                                    type="number"
                                    id="discountedPirce"
                                    className='w-40 border border-gray-300 rounded-lg p-2'
                                    onChange={handleChange}
                                    value={formData.discountPrice}
                                    name='discountPrice'
                                    min='10'
                                    max='1000'

                                />
                                <div>
                                    <p>Discount Price</p>
                                    {formData.type !== 'sale' && <span className='text-xs'>($ / Month)</span>}
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className=' flex flex-col gap-4 flex-1'>
                    <p> <b>Images:</b>  The first image will be cover (max 6)</p>
                    <form className='flex items-center gap-2 '>

                        <input
                            onChange={e => setFiles(e.target.files)}
                            type='file'
                            accept='image/*' multiple
                            className='p-2 border border-gray-300 rounded w-full'
                        />
                        <button
                            type='button'
                            onClick={handleImageUpload}
                            className='border border-green-500 text-green-700 uppercase p-2.5 rounded hover:shadow-lg'>
                            {uploading ? "uploading..." : "Upload"}
                        </button>

                    </form>
                    <p className='text-red-700'>{imageUploadError && imageUploadError}</p>
                    {
                        formData?.imageUrls?.length > 0 &&

                        formData.imageUrls.map((url, i) => (
                            < div key={url} className='flex justify-between border p-2 items-center '>
                                <img src={url} alt="listing img" className='w-20 h-20 object-cover rounded-lg' />
                                <button
                                    type='button'
                                    onClick={() => handleDeleteImage(i)}
                                    className='p-2 border border-red-300 h-10 text-red-500 rounded-lg hover:text-red-700 hover:shadow-lg'>
                                    Delete
                                </button>
                            </div>
                        ))
                    }

                    <button
                        disabled={uploading || loading}
                        className='bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-80 item-center text-center'
                    >
                        {loading ? 'Updating...' : 'Update Listing'}
                    </button>
                    {error && <p className='text-red-700'>{error}</p>}
                    {succesMessage && <p className='text-green-700'>{succesMessage}!</p>}
                </div>
            </form>
        </main>
    )
}
