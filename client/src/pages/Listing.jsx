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


const Listing = () => {
    SwiperCore.use([Navigation]);
    const { listingId } = useParams('id')
    const [listing, setListing] = useState('');
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
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
    return (
        <>
            {loading && <p className='text-center p-7 text-2xl'>Loading...</p>}
            {error && <p className='text-center p-7 text-xl'>{error}</p>}
            {listing && !error && !loading && (
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
            )}

            {/* <img className=' h-96 bg-slate-400 ' src='' alt='post image' /> */}
            <div className='fixed top-24 right-8 text-lg p-2 rounded-full bg-white cursor-pointer'>
                <FaShare className='text-slate-700' />
            </div>
            <div className='p-2 max-w-3xl mx-auto'>
                <p className='text-2xl font-semibold py-5'>
                    Tranquil Lakeside Retreat - $ 733,000
                </p>
                <p className=' text-sm flex items-center gap-1'><FaMapMarkerAlt className=' text-green-800 ' /><span className='  font-semibold text-slate-500'>789 Serenity Drive, Lakeview Haven, FAKE789</span></p>
                <div className='flex'>
                    <p className='bg-red-900 px-2 my-2 w-full max-w-[200px] text-center text-white rounded-lg'>For sale</p>
                    <p className='bg-green-900 px-2 m-2 w-full max-w-[200px] text-center text-white rounded-lg'>3000$ Discount</p>
                </div>
                <p className='text-sm'><span className='font-semibold text-base'> Description</span> - Escape the hustle and bustle of city life in this 4-bedroom, 2-bathroom lakeside home.
                    Fish off your own private dock, take in breathtaking sunsets from the screened porch,
                    and unwind in the spacious master suite. Perfect for nature enthusiasts.</p>
                <ul className='text-green-800 font-semibold text-sm my-2 flex flex-wrap items-center gap-4 sm:gap-6'>
                    <li className='flex items-center gap-1 whitespace-nowrap'   ><FaBed /> 2 Beds</li>
                    <li className='flex items-center gap-1 whitespace-nowrap  '> <FaBath /> 4 Baths</li>
                    <li className='flex items-center gap-1 whitespace-nowrap  '> <FaParking /> No Parking</li>
                    <li className='flex items-center gap-1 whitespace-nowrap  '> <FaChair /> Furnished</li>
                </ul>
                <div className='flex flex-col' >
                    <p className='py-2'>Contact for <span className='font-semibold'>tranquil lakeside retreat</span></p>
                    <textarea type="text" className='p-2 rounded-md border border-slate-300'
                        placeholder='Enter your message here...' />
                    <button className='my-4 p-2 bg-slate-700 rounded-lg text-white uppercase'>Send Message</button>


                </div>
            </div>
        </>
    )
}

export default Listing