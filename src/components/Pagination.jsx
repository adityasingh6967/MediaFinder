import React from 'react';

const Pagination = ({ page, setpage }) => {
  const pages = [1, 2, 3, 4];
  const previousPage = () => {
    if (page > 1) {
      setpage(page - 1);
    }
  }
  const nextPage = () => {
    if (page < 4) {
      setpage(page + 1);
    }
  }

  return (
    <div aria-label="Page navigation example" className="flex justify-center mt-10 pb-10">
      <ul className="flex items-center -space-x-px h-10 text-sm">
        <li onClick={previousPage} className='cursor-pointer'>
          <a className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-white bg-neutral-900 border border-e-0 border-neutral-700 rounded-s-lg hover:bg-neutral-800 hover:font-semibold font-medium">Previous</a>
        </li>
        {pages.map((pgNum) => {
          return (
            <li className='cursor-pointer' onClick={() => setpage(pgNum)} key={pgNum}>
              <a className={`flex items-center justify-center px-4 h-10 leading-tight text-white ${page === pgNum ? 'bg-neutral-950 border-2 border-neutral-800' : 'bg-neutral-900 border border-neutral-700'} hover:bg-neutral-800 hover:text-white`}>{pgNum}</a>
            </li>
          )
        })}
        <li onClick={nextPage} className='cursor-pointer'>
          <a className="flex items-center justify-center px-4 h-10 leading-tight text-white bg-neutral-900 border border-neutral-700 rounded-e-lg font-medium hover:bg-neutral-800 hover:font-semibold">Next</a>
        </li>
      </ul>
    </div>
  )
}

export default Pagination