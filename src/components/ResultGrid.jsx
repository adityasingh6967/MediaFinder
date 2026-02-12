import React, { useEffect, useState } from 'react';
import { setResults, setError, setLoading, clearResults } from '../redux/features/searchSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPhotos, fetchVideos, fetchGIFs } from '../api/mediaApi';
import ResultCard from './ResultCard';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import { setEditorImage } from '../redux/features/editorSlice';

const ResultGrid = () => {
  const { query, activeTab, results, loading, error } = useSelector((state) => state.search);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEditClick = (image) => {
    console.log('clicked');
    dispatch(setEditorImage(image));
    navigate('/edit');
  };

  const [page, setpage] = useState(1)

  const getData = async () => {
    try {
      dispatch(setLoading(true));
      let Data = [];

      if (activeTab === 'Home') {
        const response = await fetchPhotos(query, page);

        Data = response.results.map((item) => ({
          id: item.id,
          title: item.alt_description,
          type: 'photo',
          description: item.description,
          thumbnail: item.urls.small,
          url: item.urls.full,
          photographer: item.user.name
        }));

        console.log(Data);
      }
      else if (activeTab === 'Videos') {
        const response = await fetchVideos(query);

        Data = response.videos.map((item) => ({
          id: item.id,
          type: 'video',
          thumbnail: item.image,
          title: item.user.name || `${query} Video`,
          duration: item.duration,
          url: item.video_files[0].link,
          publisher: item.user.name,
        }));
        console.log(Data);
      }
      else if (activeTab === 'GIFs') {
        const response = await fetchGIFs(query, page);

        const gifs = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

        Data = gifs.map((item) => ({
          id: item.id,
          title: item.title || 'GIF',
          type: 'gif',
          description: item.title,
          thumbnail: item.file?.sm?.gif?.url,
          url: item.file?.md?.gif?.url || item.file?.hd?.gif?.url,
        }));

        console.log('GIFS FOUND:', Data.length);
      }



      dispatch(setResults(Data));
    } catch (err) {
      dispatch(setError(err.message));
    }
  }

  useEffect(() => {
    if (query) {
      getData();
    }
  }, [query, activeTab, page]);

  if (error) {
    console.log(error);
    return <div className="text-2xl font-semibold text-center mx-auto mt-8 text-red-500">Unexpected Error occured! <br /> Reload or try again later.</div>;
  }
  if (loading) return (
    <div className="scale-[3.3] h-12.5 w-10 mt-30 mx-auto">
      <div className="box relative opacity-0 left-2.5 box-1">
        <div className="side-left"></div>
        <div className="side-right"></div>
        <div className="side-top"></div>
      </div>
      <div className="box relative opacity-0 left-2.5 box-2">
        <div className="side-left"></div>
        <div className="side-right"></div>
        <div className="side-top"></div>
      </div>
      <div className="box relative opacity-0 left-2.5 box-3">
        <div className="side-left"></div>
        <div className="side-right"></div>
        <div className="side-top"></div>
      </div>
      <div className="box relative opacity-0 left-2.5 box-4">
        <div className="side-left"></div>
        <div className="side-right"></div>
        <div className="side-top"></div>
      </div>
    </div>
  );
  if (!query) {
    return <div className="text-2xl font-semibold text-center mx-auto mt-8">Waiting for you to search and we'll give <br /> you the best results</div>;
  }
  if (results.length === 0 && !loading && query) {
    return <div className="text-xl font-semibold text-center mx-auto mt-8">We are sorry but we are not able to find results for "{query}"</div>;
  }

  return (
    <div>
      <div className="columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4 p-4">
        {results?.map((item) => (
          <ResultCard

            key={item.id}
            item={item}
            colCard={false}
            onEdit={() => { handleEditClick(item) }} />
        ))}
      </div>

      {activeTab === 'Home' | activeTab === 'GIFs' && results.length > 0 && <Pagination page={page} setpage={setpage} />}
    </div>
  )
}

export default ResultGrid