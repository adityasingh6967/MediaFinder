import React from 'react'
import SearchBar from '../components/SearchBar';
import ResultGrid from '../components/ResultGrid';
import Tabs from '../components/Tabs';
import SearchDiv from '../components/SearchDiv';

const HomePage = () => {
    return (

        <section className='min-[1000px]:px-50 min-[500px]:px-10 px-5'>
            <SearchDiv />
            <div>
                <Tabs />
            </div>
            <div>
                <ResultGrid />
            </div>
        </section>
    )
}

export default HomePage