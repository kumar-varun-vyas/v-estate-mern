import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignIn = () => {
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
        setError(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'content-Type': 'application/json',
                },
                body: JSON.stringify(formData)

            })
            const data = await res.json();

            if (data.success == false) {
                setError(data.errMessage)

            } else {
                navigate('/')
            }
            setLoading(false)
            console.log("data---", data)

        } catch (err) {
            setLoading(false)
            console.log(err)
            setError(data.errMessage)

        }

    }
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type="email" placeholder="email"
                    className="border p-3 rounded-lg " id='email' onChange={handleChange} />
                <input type="password" placeholder="password"
                    className="border p-3 rounded-lg " id='password' onChange={handleChange} />

                <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase 
                hover:opacity-90 disabled:opacity-80'>{loading ? 'loading...' : 'Sign in'}</button>

            </form>
            {error && <div className='text-red-700'> {error}</div>}
            <div className='flex gap-2 mt-5'>
                <p>Dont have an account? </p>
                <Link to={"/sign-up"}>
                    <span className='text-blue-700 '> Sign up</span>
                </Link>
            </div>
        </div>
    )
}

export default SignIn