import React, { useEffect, useState } from 'react'
import { Search, Image, Film, ChevronDown, ImagePlay } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setQuery, setActiveTab } from '../redux/features/searchSlice';

const SearchBar = () => {
  const [SearchInput, setSearchInput] = useState('')
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.search.activeTab)
  const [Option, setOption] = useState('')
  const [display, setdisplay] = useState('hidden')

  useEffect(() => {
    if (activeTab === 'Home') {
      setOption('Images')
    }
    if (activeTab === 'Videos') {
      setOption('Videos')
    }
    if (activeTab === 'GIFs') {
      setOption('GIFs')
    }
  }, [activeTab])
  const formSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(setQuery(SearchInput));
    console.log(SearchInput + '  ' + activeTab);
  }
  return (
    <form onSubmit={(e) => { formSubmitHandler(e) }} className='w-full relative bg-neutral-800 rounded-xl flex flex-nowrap items-center lg:p-3 p-2 sm:gap-4 gap-2'>
      <div className='relative shrink-0' onMouseEnter={() => setdisplay('flex')} onMouseLeave={() => setdisplay('hidden')}>
        <div className='cursor-pointer bg-neutral-900 hover:bg-[#333] rounded-xl sm:p-3 p-2 font-medium duration-200 flex items-center gap-1 whitespace-nowrap'>
          {Option === 'Photos' ? (
            <Image className='h-4 w-4 sm:h-5 sm:w-5' />
          ) : (
            <Film className='h-4 w-4 sm:h-5 sm:w-5' />
          )}
          {Option}
          <ChevronDown className='h-3.5 w-3.5 sm:h-4 sm:w-4' strokeWidth={3} />
        </div>
        
        <div className={`absolute ${display} z-10 top-12 left-0 border-neutral-400 gap-1 flex-col border bg-[#191919] rounded-xl p-1.5 min-w-40`}>
          <div onClick={() => {
            dispatch(setActiveTab('Home'))
          }} className='cursor-pointer hover:bg-[#333] rounded-lg p-3 font-medium duration-200 flex items-center gap-1'>
            <Image className='h-4 w-4 sm:h-5 sm:w-5' color='limegreen' />
            Images
          </div>
          <div onClick={() => {
            dispatch(setActiveTab('Videos'))
          }} className='cursor-pointer hover:bg-[#333] rounded-lg p-3 font-medium duration-200 flex items-center gap-1'>
            <Film className='h-4 w-4 sm:h-5 sm:w-5' color='#0055ff' />
            Videos
          </div>
          <div onClick={() => {
            dispatch(setActiveTab('GIFs'))
          }} className='cursor-pointer hover:bg-[#333] rounded-lg p-3 font-medium duration-200 flex items-center gap-1'>
            <ImagePlay className='h-4 w-4 sm:h-5 sm:w-5' color='yellow' />
            GIFs
          </div>
        </div>
      </div>

      <input type="text" placeholder={`Search ${Option} as for your need...`} value={SearchInput} onChange={(e) => {
        setSearchInput(e.target.value)
      }} required className='w-full min-w-0 searchInput font-medium outline-none sm:py-2 py-1 px-1 sm:text-[1.1rem] text-base' />
      <button className='cursor-pointer hover:bg-[#333] rounded-xl sm:p-3 p-2 duration-200 shrink-0'>
        <Search className='h-4 w-4 sm:h-5 sm:w-5' strokeWidth={2.75} color='rgb(190,190,190)' />
      </button>
    </form>
  )
}

export default SearchBar
