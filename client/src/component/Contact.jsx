import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Contact({ listing }) {
    const [landlord, setLandLord] = useState(null)
    const [message, setMessage] = useState('')
    useEffect(() => {
        // console.log(listing.userRef)
        try {
            const fetchLandlord = async () => {
                // setLoading(true)
                let res = await fetch(`/api/user/${listing.userRef}`)
                let data = await res.json()

                if (data.success === false) {
                    console.log("get single listing====", data.message)
                    return
                }
                setLandLord(data.data)
            }
            fetchLandlord()
        }
        catch (err) {
            console.log(err)
        }

    }, [])

    const onChange = (e) => {
        setMessage(e.target.value)
    }
    return (
        <>


            {landlord &&
                <div className='flex flex-col'>

                    <p className='py-2'>Contact {landlord.username} for <span className='font-semibold'>{listing.name}</span></p>
                    <textarea type="text" className='p-2 rounded-md border border-slate-300' rows={2} id='message'
                        placeholder='Enter your message here...' value={message} onChange={onChange} />
                    <p>Will be develop soon...</p>
                    {/* <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                        className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
                    >Send Message </Link> */}
                </div>
            }
        </>
    )
}

export default Contact