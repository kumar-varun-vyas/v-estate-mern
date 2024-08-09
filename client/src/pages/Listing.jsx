import React, { useState, useEffect } from 'react'
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle';
import { useSelector } from 'react-redux';
import Contact from '../component/Contact';


const Listing = () => {
    SwiperCore.use([Navigation]);
    const { listingId } = useParams('id')
    const [listing, setListing] = useState('');
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [showContact, setShowContact] = useState(false)
    const { currentUser } = useSelector(state => state.user)
    useEffect(() => {
        try {
            const fetchListing = async () => {
                setLoading(true)
                let res = await fetch(`/api/listing/get/${listingId}`)
                let data = await res.json()

                if (data.success === false) {
                    console.log("get single listing====", data.message)
                    setError(data.message)
                    setLoading(false)
                    return
                }
                setListing(data.data)
                setLoading(false)
            }
            fetchListing()
        } catch (error) {
            setError(true)
            setLoading(false)
        }

    }, [])
    const openContact = () => {
        setShowContact(true)
    }

    return (
        <>
            {loading && <p className='text-center p-7 text-2xl'>Loading...</p>}
            {error && <p className='text-center p-7 text-xl'>{error}</p>}
            {listing && !error && !loading && (
                <div>
                    <div>
                        <Swiper navigation>
                            {listing.imageUrls.map((url =>
                                <SwiperSlide key={url}>
                                    <div className='h-[550px]' style={
                                        { background: `url(${url}) center no-repeat `, backgroundSize: 'cover' }
                                    }></div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>


                    {/* <img className=' h-96 bg-slate-400 ' src='' alt='post image' /> */}
                    <div className='fixed top-24 right-8 text-lg p-2 rounded-full bg-white cursor-pointer'>
                        <FaShare className='text-slate-700' />
                    </div>
                    <div className='p-2 max-w-3xl mx-auto'>
                        <p className='text-2xl font-semibold py-5'>
                            {listing.name}

                        </p>
                        <p className=' text-sm flex items-center gap-1'><FaMapMarkerAlt className=' text-green-800 ' /><span className='  font-semibold text-slate-500'> {listing.address}</span></p>
                        <div className='flex'>
                            <p className='bg-red-900 px-3 my-2 w-full max-w-[200px] text-center text-white rounded-lg'>{listing.type == 'rent' ? "For Rent" : "For sale"}</p>
                            <p className='bg-green-900 px-3 m-2 w-full max-w-[200px] text-center text-white rounded-lg'>{listing.offer ? `Offer Price ${+listing.regularPrice - +listing.discountPrice}$` : ` ${+listing.regularPrice} $/month`} </p>
                        </div>
                        {listing.description && <p className='text-sm'><span className='font-semibold text-base'> Description</span> - {listing.description}</p>}
                        <ul className='text-green-800 font-semibold text-sm my-2 flex flex-wrap items-center gap-4 sm:gap-6'>
                            {listing.bedrooms > 0 && <li className='flex items-center gap-1 whitespace-nowrap'   ><FaBed /> {listing.bedrooms} Beds</li>}
                            {listing.bathrooms > 0 && <li className='flex items-center gap-1 whitespace-nowrap  '> <FaBath />{listing.bathrooms} Baths</li>}
                            <li className='flex items-center gap-1 whitespace-nowrap  '> <FaParking /> {listing.parking ? "Parking" : "No Parking"}</li>
                            <li className='flex items-center gap-1 whitespace-nowrap  '> <FaChair />{listing.furnished ? 'Furnished' : 'No Furnished'} </li>
                        </ul>
                        <div className='flex flex-col' >
                            {currentUser && listing.userRef !== currentUser._id && <>
                                {showContact && (<>
                                    <Contact listing={listing} />

                                </>)}

                                <button className='my-4 p-2 bg-slate-700 rounded-lg text-white uppercase hover:opacity-95' onClick={openContact}>{!showContact ? "Contact landlord" : 'Send Message'}</button>
                            </>
                            }

                        </div>

                    </div>
                </div>
            )}
        </>
    )
}

export default Listing