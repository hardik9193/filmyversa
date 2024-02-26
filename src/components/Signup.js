import React, { useState } from 'react'
import { TailSpin } from 'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import app, { usersRef } from "../firebase/firebase";
import swal from 'sweetalert';
import { addDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

const auth = getAuth(app);

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        mobile: "",
        password: ""
    })

    const [otpSent, setOtpSent] = useState(false)
    const [OTP, setOTP] = useState("");


    const generateRecaptha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
    }

    const requestOtp = () => {
        setLoading(true);
        generateRecaptha();

        let appVerifier = window.recaptchaVerifier;
        let mobilenumber = `+91${form.mobile}`
        signInWithPhoneNumber(auth, mobilenumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                swal({
                    text: "OTP Sent",
                    icon: "success",
                    buttons: false,
                    timer: 3000,
                });
                setOtpSent(true);
                setLoading(false);
            }).catch((error) => {
                console.log(error);
            })


        //setLoading(false);
    }

    const verifyOTP = () => {
        try {
            setLoading(true)
            window.confirmationResult.confirm(OTP).then((result) => {
                uploadData();
                swal({
                    text: "Successfully Registered!",
                    icon: "success",
                    buttons: false,
                    timer: 3000,
                });
            })
            setLoading(false);
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
    }

    const uploadData = async () => {
        const salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(form.password, salt);

        await addDoc(usersRef, {
            name: form.name,
            password: hash,
            mobile: form.mobile,

            // name: form.name,
            // mobile: form.mobile,
            // password: form.password,
        })
    }

    return (
        <div className="w-full flex flex-col mt-8 items-center">
            <h1 className="text-xl font-bold">Sign up</h1>
            {otpSent ?
                <>
                    <div className="p-2 w-full md:w-1/3">
                        <div className="relative">
                            <label className="leading-7 text-sm text-gray-300">
                                OTP
                            </label>
                            <input

                                name="message"
                                value={OTP}
                                onChange={(e) => setOTP(e.target.value)}
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            />
                        </div>
                    </div>
                    <div className="p-2 w-full">
                        <button onClick={verifyOTP}

                            className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
                        >
                            {loading ? <TailSpin height={25} color="white" /> : "Confirm OTP"}
                        </button>
                    </div>

                </>
                :
                <>
                    <div className="p-2 w-full md:w-1/3">
                        <div className="relative">
                            <label className="leading-7 text-sm text-gray-300">
                                Name
                            </label>
                            <input

                                name="message"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            />
                        </div>
                    </div>
                    <div className="p-2 w-full md:w-1/3">
                        <div className="relative">
                            <label htmlFor="message" className="leading-7 text-sm text-gray-300">
                                Mobile No.
                            </label>
                            <input
                                type={"number"}
                                id="message"
                                name="message"
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
                                type={'password'}
                                id="message"
                                name="message"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            />
                        </div>
                    </div>
                    <div className="p-2 w-full">
                        <button
                            onClick={requestOtp}
                            className="flex mx-auto text-white bg-green-600 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
                        >
                            {loading ? <TailSpin width={25} height={25} color='#fff' /> : "Request OTP"}
                        </button>
                    </div>
                </>
            }
            <div>
                <p>Already have an account <Link to={'/login'}><span className="text-blue-500">Login</span></Link></p>
            </div>
            <div id="recaptcha-container"></div>
        </div>
    )
}

export default Signup