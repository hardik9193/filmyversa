import React, { useContext, useEffect, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner';
import ReactStars from 'react-stars'
import { movieRef } from "../firebase/firebase"
import { getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Appstate } from '../App';



const Cards = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useContext(Appstate)

    useEffect(() => {
        async function getData() {
            setLoading(true);
            let _data = await getDocs(movieRef);
            _data.forEach((doc) => {
                setData((prev) => [...prev, { ...doc.data(), id: doc.id }]);
            })
            setLoading(false);

        }
        getData();

    }, []);


    return (
        <div className="flex flex-wrap px-3 mt-2">
            {loading ? <div className='loader-show'><ThreeDots width={50} height={50} /></div>
                :
                data.map((ele, i) => {
                    return (
                        // <Link to={`/detail/${ele.id}`} key={i} >
                        <Link to={`/detail/${ele.id}`} key={i} className="card font-medium shadow-lg p-2  cursor-pointer mt-6 transition-all duration-500">
                            <img className="w100" src={ele.image} />
                            <h1>
                                {ele.title}
                            </h1>
                            <h1 className="flex items-center">
                                <span className="text-gray-500 mr-1">Rating:</span>
                                <ReactStars
                                    size={20}
                                    half={true}
                                    value={ele.rating / ele.rated}
                                    edit={false}
                                />
                            </h1>
                            <h1>
                                <span className="text-gray-500">Year:</span> {ele.year}
                            </h1>
                        </Link>
                        // </Link>
                    )
                })


            }
        </div >
    )
}

export default Cards