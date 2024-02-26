import { getDocs, query, where } from 'firebase/firestore'
import React, { useContext, useState } from 'react'
import { TailSpin } from 'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom'
import swal from 'sweetalert'
import { usersRef } from '../firebase/firebase'
import { Appstate } from '../App'
import bcrypt from 'bcryptjs';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const navigate = useNavigate();
    const useAppstate = useContext(Appstate)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        mobile: 0,
        password: "",
    })


    const login = async () => {
        setLoading(true)
        try {

            const fetchData = query(usersRef, where("mobile", "==", form.mobile));
            const fetchDataSnap = await getDocs(fetchData);

            fetchDataSnap.forEach((hardik) => {
                const _data = hardik.data();
                const isUser = bcrypt.compareSync(form.password, _data.password);
                if (isUser) {
                    useAppstate.setLogin(true);
                    useAppstate.setUsername(_data.name);
                    toast.success('Successfully Loggedin 😀', {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    navigate('/');

                } else {
                    toast.error('Invalid credentials 😕', {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    // swal({
                    //     title: "Invalid credentials !!",
                    //     icon: "error",
                    //     buttons: false,
                    //     timer: 3000
                    // })
                }

            })

        } catch (error) {
            swal({
                title: error.message,
                icon: "error",
                buttons: false,
                timer: 3000
            })
        }
        setLoading(false)
    }

    return (
        <div className="w-full flex flex-col mt-8 items-center">

            <h1 className="text-xl font-bold">Login</h1>
            <div className="p-2 w-full md:w-1/3">
                <div className="relative">
                    <label htmlFor="message" className="leading-7 text-sm text-gray-300">
                        Mobile No.
                    </label>
                    <input
                        type='number'
                        id="mobile"
                        value={form.mobile}
                        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                </div>
            </div>
            <div className="p-2 w-full md:w-1/3">
                <div className="relative">
                    <label htmlFor="message" className="leading-7 text-sm text-gray-300">
                        Password
                    </label>
                    <input
                        type='password'
                        id='password'
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}

                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                </div>
            </div>
            <div className="p-2 w-full">
                <button
                    onClick={login}
                    className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
                >

                    {
                        loading ? <TailSpin width={25} height={25} color='#fff' /> : "Login"
                    }
                </button>
            </div>
            <div>
                <p>Do not have account? <Link to={'/signup'}><span className="text-blue-500">Sign Up</span></Link></p>
            </div>
        </div>
    )
}

export default Login