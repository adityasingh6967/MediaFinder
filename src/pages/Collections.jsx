import { useSelector, useDispatch } from 'react-redux'
import ResultCard from '../components/ResultCard';
import { clearCollection } from '../redux/features/collectionSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setEditorImage } from '../redux/features/editorSlice';

const Collections = () => {
    const collection = useSelector((state) => state.collection.items)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleEditClick = (image) => {
        console.log('clicked');
        dispatch(setEditorImage(image));
        navigate('/edit');
    };

    const navBar = () => {
        if (collection.length > 0) {
            return (
                <div className='flex justify-between items-center'>
                    <h1 className='font-semibold text-3xl'>Your Collection</h1>
                    <button onClick={() => {
                        dispatch(clearCollection())
                    }} className='bg-neutral-950 border border-neutral-700 hover:bg-neutral-800 duration-200 cursor-pointer text-lg font-medium py-2 px-4 rounded-lg'>Clear All</button>
                </div>
            )
        }
    }

    return (
        <div>
            <div className='w-[80%] mt-6 mx-auto'>
                {navBar()}

                {collection && collection.length > 0 ? (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 p-4 mt-4">
                        {collection.map((item) => (
                            <ResultCard
                                key={item.id}
                                item={item}
                                colCard={true}
                                onEdit={() => {handleEditClick(item)}}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-2xl font-semibold text-center mx-auto mt-8">Your collection is empty.</div>
                )}
            </div>
        </div>
    )
}

export default Collections