import React, { useEffect, useRef } from 'react'
import { useContentStore } from '../store/content'
import { Link } from 'react-router-dom';
import { SMALL_IMG_BASE_URL } from '../utils/constants';
import { useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MovieSlider = ({ category }) => {
    const { contentType, setContentType } = useContentStore()
    const [content, setContent] = useState([]);
    const [showArrows, setShowArrows] = useState(false);

    const sliderRef = useRef(null);

    const formattedCategory = category.replaceAll("_", " ")[0].toUpperCase() + category.replaceAll("_", " ").slice(1);
    const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";

    useEffect(() => {
        const getContent = async () => {
            const res = await axios.get(`/api/v1/${contentType}/${category}`);
            setContent(res.data.content);
        }

        getContent();
    }, [contentType, category])

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: -sliderRef.current.offsetWidth, behavior: 'smooth'
            });
        }
    }

    const scrollRight = () => {
        sliderRef.current.scrollBy({
            left: sliderRef.current.offsetWidth, behavior: 'smooth'
        });
    }

    return (
        <div
            className='text-white bg-black relative px-5 md:px-20'
            onMouseEnter={() => setShowArrows(true)}
            onMouseLeave={() => setShowArrows(false)}
        >
            <h2 className='mb-4 text-2xl font-bold'>{formattedCategory} {formattedContentType}</h2>

            <div className="flex space-x-4 overflow-x-scroll scrollbar-hide" ref={sliderRef}>
                {content.map((item) => (
                    <Link to={`/watch/${item.id}`} className='min-w-[250px] relative group' key={item.id}>
                        <div className="rounded-lg overflow-hidden">
                            <img src={SMALL_IMG_BASE_URL + item.backdrop_path} alt="Movie image" className='transition-transform duration-300 ease-in-out group-hover:scale-125' />
                        </div>
                        <p className="mt-2 text-center">
                            {item.title || item.name}
                        </p>
                    </Link>
                ))}
            </div>

            {showArrows && (
                <>
                    <button
                        onClick={scrollLeft}
                        className='absolute left-5 md:left-24 top-1/2 transform -translate-y-1/2 flex items-center justify-center size-12 z-10 bg-black rounded-full hover:bg-opacity-75 text-white'>
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={scrollRight} className='absolute right-5 md:right-24 top-1/2 transform -translate-y-1/2 flex items-center justify-center size-12 z-10 bg-black rounded-full hover:bg-opacity-75 text-white'>
                        <ChevronRight size={24} />
                    </button>
                </>
            )}
        </div>
    )

}

export default MovieSlider