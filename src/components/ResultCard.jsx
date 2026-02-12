import React, { useState } from 'react'
import { X, Save } from 'lucide-react';
import { useDispatch } from 'react-redux';
import ResultDialogue from './ResultDialogue';
import { addCollection, removeFromCollection } from '../redux/features/collectionSlice';

const ResultCard = ({ item, colCard, onEdit }) => {
  const dispatch = useDispatch();

  const addToCollection = (item) => {
    dispatch(addCollection(item));
  }

  const removeCard = (item) => {
    dispatch(removeFromCollection(item));
  }

  const [IsDialogueOpen, setIsDialogueOpen] = useState(false);
  const onClickHandler = () => {
    setIsDialogueOpen(true);
  }

  const onCloseHandler = () => {
    setIsDialogueOpen(false);
  }


  const buttonValue = () => {
    if (colCard === false) {
      return (
        <>
          <Save size={20} />
        </>
      )
    } else if (colCard === true) {
      return (<>
        <X size={20} />
      </>
      )
    }
  }

  return (<>
    <div onClick={() => { onClickHandler() }} key={item.id} className="group border rounded-lg border-neutral-800 break-inside-avoid relative cursor-pointer">
      <img
        src={item.thumbnail}
        alt={item.title}
        className="w-full group-hover:brightness-70 h-auto rounded-lg object-cover duration-200"
      />
      <h1 className="text-xl -translate-x-10 group-hover:-translate-x-1 first-letter:text-3xl font-semibold capitalize group-hover:opacity-100 opacity-0 duration-200 absolute bottom-2 left-5">{item.title}</h1>
      <button onClick={(e) => {
        e.stopPropagation();
        if (colCard) {
          removeCard(item);
        } else if (colCard === false) {
          addToCollection(item);
        }
      }} className="absolute top-3 right-5 translate-x-10 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none duration-200 p-3.5 cursor-pointer bg-neutral-800 color-white rounded-full text-lg hover:bg-[#202020] font-medium">{buttonValue()}</button>
    </div>

    {IsDialogueOpen && (
      <ResultDialogue
        onClose={onCloseHandler}
        colCard={colCard}
        item={item}
        onEdit={() => onEdit(item)}
      />
    )}
  </>
  )
}

export default ResultCard