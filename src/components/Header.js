import React, { useContext } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Appstate } from '../App';

const Header = () => {
    const useAppstate = useContext(Appstate)
    return (
        <div className='sticky z-10 header top-0 text-3xl flex  items-center text-red-500 font-bold p-3 border-b-2 border-gray-500'>
            <Link to={"/"}> <span>Filmy<span className='text-white'>Verse</span></span></Link>

            {
                useAppstate.login ?
                    <div className='actions'>
                        <div className='text-lg cursor-pointer flex items-center ml-10 hover:bg-violet-700'>
                            <Link to={'/addmovie'}>
                                <Button><AddIcon className='mr-1' color='secondary' /> <span className='text-white'>Add New</span></Button>
                            </Link>
                        </div>
                        <div className='text-lg bg-red-500 cursor-pointer flex items-center ml-10'>
                            <Link to={"/login"}>
                                <Button><span className='text-white font-medium capitalize'>Logout</span></Button>
                            </Link>
                        </div>
                    </div>
                    :
                    <div className='actions'>
                        <div className='text-lg bg-green-500 cursor-pointer flex items-center'>
                            <Link to={"/login"}>
                                <Button><span className='text-white font-medium capitalize'>Login</span></Button>
                            </Link>
                        </div>
                    </div>
            }


        </div>
    )
}

export default Header