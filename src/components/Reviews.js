import React, { useContext, useEffect, useState } from 'react'
import ReactStars from 'react-stars'
import { reviewRef, db } from '../firebase/firebase'
import { addDoc, getDoc, getDocs, doc, updateDoc, query, where } from 'firebase/firestore'
import { TailSpin, ThreeDots } from 'react-loader-spinner'
import swal from 'sweetalert'
import { Appstate } from '../App'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Reviews = ({ id, prevRating, userRated }) => {
    const useAppstate = useContext(Appstate);
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [form, setForm] = useState("");
    const [data, setData] = useState([]);
    const [newAdded, setNewAdded] = useState(0);

    const sendReview = async () => {
        setLoading(true)
        try {
            if (useAppstate.login) {
                await addDoc(reviewRef, {
                    movieid: id,
                    name: useAppstate.username,
                    rating: rating,
                    thought: form,
                    timestamp: new Date().getTime()
                });


                toast.success('Successfully added!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });


                const docRef = doc(db, "movies", id);
                await updateDoc(docRef, {
                    rating: prevRating + rating,
                    rated: userRated + 1
                });

                setForm("")
                setRating(0)
                setNewAdded(newAdded + 1);
            } else {
                navigate('/login');
            }
        } catch (error) {
            swal({
                title: error.message,
                icon: "error",
                buttons: true,
                timer: 3000
            })
        }
        setLoading(false);
    }

    // useEffect(() => {
    //     async function getData() {
    //         setReviewLoading(true)
    //         const queryreview = query(reviewRef, where('movieid', '==', id));
    //         const querySnap = await getDoc(queryreview);
    //         querySnap.forEach((doc) => {
    //             setData((prev) => [...prev, doc.data()])
    //         })
    //         setReviewLoading(false)
    //     }
    //     getData();
    // }, [newAdded]);

    useEffect(() => {
        async function getData() {
            setReviewLoading(true);
            setData([]);
            let quer = query(reviewRef, where('movieid', '==', id))
            const querySnapshot = await getDocs(quer);

            querySnapshot.forEach((doc) => {
                setData((prev) => [...prev, doc.data()])
            })

            setReviewLoading(false);
        }
        getData();
    }, [newAdded])

    return (
        <div className='mt-4 border-t-2 border-gray-700 w-full'>
            <ReactStars
                size={30}
                half={true}
                value={rating}
                onChange={(rate) => setRating(rate)}
            />
            <input
                placeholder='Share Your thoughts...'
                className='w-full p-2 outline-none header'
                value={form}
                onChange={(e) => setForm(e.target.value)}
            />
            <button className='bg-green-600 flex justify-center w-full p-2' onClick={sendReview}>
                {loading ? <TailSpin width={30} height={30} color='#fff' /> : "Share"}
            </button>

            <div className='mt-4'>
                {
                    reviewLoading ? <ThreeDots />
                        : data.map((e, i) => {
                            return (
                                <div className=' p-2 w-full border-b header bg-opacity-50 border-gray-600 mt-2' key={i} >
                                    <div className='flex items-center'>
                                        <p className='text-blue-500'>{e.name}</p>
                                        <p className='ml-3 text-xs'>{new Date().toLocaleDateString()}</p>
                                    </div>
                                    <ReactStars
                                        size={15}
                                        half={true}
                                        value={e.rating}
                                        edit={false}
                                    />
                                    <p>{e.thought}</p>
                                </div>
                            )
                        })

                }

            </div>
        </div>
    )
}

export default Reviews