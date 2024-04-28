import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailuer, signInStart, signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'



export default function OAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleClick = async () => {
        try {
            dispatch(signInStart())
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)

            const res = await fetch('api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL })
            },
            )
            const data = await res.json()
            if (!data.error) {
                navigate('/')
            } else {
                dispatch(signInFailuer(error.message))
            }
            console.log('outh --', data)
            dispatch(signInSuccess(data.data))

        } catch (error) {
            console.log('Could not sign in with google ', error)
            dispatch(signInFailuer(error.message))
        }
    }

    return (

        <button onClick={handleGoogleClick} type='button' className='text-white bg-red-500 p-3 rounded-lg uppercase hover:opacity-95'>
            Google Oauth
        </button>


    )
}
