import React from 'react'
import SearchBar from './SearchBar';
import { ArrowRight } from 'lucide-react';
 
const SearchDiv = () => {
    return (
        <div className='mt-10 w-full gap-5 flex flex-row-reverse items-center justify-center'>
            <div className='w-2/5 overflow-hidden hidden xl:flex rounded-2xl cursor-pointer relative'>
                <img src="../src/assets/code.jpg" className='rounded-2xl hover:brightness-50 brightness-75 hover:scale-120 duration-500' alt="" />
                <div className='absolute text-white bottom-7 left-7 flex flex-col'>
                    <h3 className='text-2xl font-bold'>Coding and Learning</h3>
                    <button className='flex font-medium text-lg cursor-pointer hover:text-neutral-300 items-center duration-150'>Join <ArrowRight size={18} /></button>
                </div>
            </div>
            <div className='xl:w-3/5 w-full flex flex-col gap-10'>
                <h1 className='xl:text-4xl md:text-xl lg:text-2xl sm:text-xl font-bold'>The best premium photos, royalty free images ,videos & GIFs.</h1>
                <SearchBar />
            </div>
        </div>
    )
}

export default SearchDiv