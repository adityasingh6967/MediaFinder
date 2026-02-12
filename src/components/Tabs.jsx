import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveTab } from '../redux/features/searchSlice';


const Tabs = () => {
  const Tabs = ['Home', 'Videos','GIFs']

  const dispatch = useDispatch();

  const activeTab = useSelector((state) => state.search.activeTab)

  return (
    <div className='mt-8 flex justify-center'>
      <div className='flex gap-2'>
        {Tabs.map((tab, index) => {
          return (
            <button key={index} onClick={() => {
              dispatch(setActiveTab(tab))
            }} 
            className={`${activeTab === tab ? 'bg-neutral-950' : ''} rounded-full font-medium  duration-200 py-3 px-6 cursor-pointer ${activeTab === tab ? 'hover:bg-[#101010]' : 'hover:bg-[#202020]'}`}>{tab}</button>
          )
        })}
      </div>
    </div>
  )
}

export default Tabs 