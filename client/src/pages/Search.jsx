import React from 'react'

function Search() {
    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
                <form className='flex flex-col gap-6'>
                    <div className='flex item-center gap-4 '>
                        <label className='whitespace-nowrap flex gap-4 items-center font-semibold' >Search Term : </label>
                        <input type="text" id="searchTerm" placeholder='Search...'
                            className='border rounded-lg p-3 w-full' />
                    </div>
                    <div className='flex gap-4 items-center'>
                        <label className='font-semibold'>
                            Type :
                        </label>
                        <div className='flex gap-2'>
                            <input type='checkBox' id="all" className='w-5' />
                            <span>Rent & Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkBox' id="Rent" className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkBox' id="Sale" className='w-5' />
                            <span>Sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkBox' id="Offer" className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex gap-4 items-center'>
                        <label className='font-semibold'>
                            Amenities :
                        </label>
                        <div className='flex gap-2'>
                            <input type='checkBox' id="Parking" className='w-5' />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkBox' id="Furnished" className='w-5' />
                            <span>Furnished</span>
                        </div>

                    </div>
                    <div className='flex items-center gap-4'>
                        <label className='font-semibold'>Sort :</label>
                        <select className='border rounded-md p-2 flex'>
                            <option>Price high to low</option>
                            <option>Price low to high</option>
                            <option>Letest</option>
                            <option>Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 rounded-lg text-white uppercase p-3 hover:opacity-80'>Search</button>

                </form>

            </div>
            <div>
                <h1 className='text-3xl font-semibold border-b text-slate-700 p-3 m-4'>Listing results:</h1>
            </div>
        </div>
    )
}

export default Search