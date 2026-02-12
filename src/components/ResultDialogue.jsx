import React, { useEffect } from 'react'
import { X, Save, Pencil } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addCollection, removeFromCollection } from '../redux/features/collectionSlice';

const ResultDialogue = ({ onClose, colCard, item, onEdit }) => {
    const dispatch = useDispatch();

    const addToCollection = () => {
        dispatch(addCollection(item));
    }

    const removeCard = () => {
        dispatch(removeFromCollection(item));
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, []);

    const editBtn = () => {
        if (item.type === 'photo') {
            return (
                <button onClick={onEdit} className='flex py-3 px-5 rounded-lg bg-neutral-900 hover:bg-neutral-950 duration-200 cursor-pointer text-[skyblue] font-medium text-lg items-center gap-1'>Edit <Pencil size={20} /></button>
            )
        }
    }

    const buttonValue = () => {
        if (colCard === false) {
            return (
                <button onClick={() => { addToCollection() }} className='flex py-3 px-5 rounded-lg bg-neutral-900 hover:bg-neutral-950 duration-200 cursor-pointer text-[limegreen] font-medium text-lg items-center gap-1'>
                    Save <Save size={20} />
                </button>
            )
        } else if (colCard === true) {
            return (
                <button onClick={() => { removeCard() }} className='flex py-3 px-5 rounded-lg bg-neutral-900 hover:bg-neutral-950 duration-200 cursor-pointer text-[red] font-medium text-lg items-center gap-1'>
                    Remove <X size={20} />
                </button>
            )
        }
    }

    return (
        <div onClick={onClose} className='fixed bg-[rgba(0,0,0,0.5)] top-0 left-0 w-full h-full z-50'>
            <div onClick={(e) => { e.stopPropagation() }} className='absolute top-[10%] left-[10%] w-[80%] h-[80%] bg-neutral-800 rounded-3xl'>
                <div className='w-full h-full relative rounded-2xl gap-8 flex p-8'>
                    <button onClick={onClose} className="rounded-full p-2.5 absolute top-1 right-1 bg-neutral-900 cursor-pointer hover:bg-neutral-950 duration-200"><X strokeWidth={2.5} /></button>
                    <a target='blank' href={item.url} className='w-1/2 min-h-fit max-h-full flex items-center justify-center'>
                        {item.type === 'photo' || item.type === 'gif' ? <img src={item.thumbnail} alt={item.title} className='max-w-full max-h-full rounded-lg object-contain' /> :
                            <video controls className='max-w-full max-h-full rounded-lg object-contain'>
                                <source src={item.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>}
                    </a>
                    <div className='w-1/2 h-fit gap-5 mt-3 flex-col flex justify-center'>
                        <h1 className='capitalize font-bold text-2xl'>{item.title}</h1>
                        <p className='font-medium text-[18px] w-4/5'>{item.description}</p>
                        <div className='flex gap-2'>
                            {
                                buttonValue()
                            }

                            {
                                editBtn()
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResultDialogue