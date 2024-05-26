import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailuer, signInStart, signInSuccess } from '../redux/user/userSlice'
import OAuth from '../component/OAuth'

const SignIn = () => {
    const [formData, setFormData] = useState({})
    const loading = useSelector((state) => state.user.loading)
    const error = useSelector((state) => state.user.error)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(signInStart())
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
                console.log(data)
                dispatch(signInFailuer(data.message))

            } else {
                dispatch(signInSuccess(data))
                navigate('/')
            }


        } catch (err) {
            dispatch(signInFailuer(err.message))

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

                <OAuth />

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