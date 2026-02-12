import axios from "axios";

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const PEXELS_KEY = import.meta.env.VITE_PEXELS_ACCESS_KEY;
const KLIPY_KEY = import.meta.env.VITE_KLIPY_ACCESS_KEY;

export async function fetchPhotos(query, page, per_page = 25) {
    const res = await axios.get("https://api.unsplash.com/search/photos", {
        params: { query, page, per_page },
        headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
    });
    return res.data;
}

export async function fetchVideos(query, per_page = 15) {
    const res = await axios.get("https://api.pexels.com/videos/search", {
        params: { query, per_page },
        headers: { Authorization: PEXELS_KEY }
    });
    return res.data;
}

export async function fetchGIFs(query, page, per_page = 15) {
    const res = await axios.get(
        `https://api.klipy.com/api/v1/${KLIPY_KEY}/gifs/search`,
        {
            params: {
                q: query,
                page,
                per_page,
                locale: "en"
            }
        }
    );
    return res.data;
}
