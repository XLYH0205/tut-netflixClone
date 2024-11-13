import React from 'react'
import { useState } from 'react'
import { useContentStore } from '../store/content';
import Navbar from '../components/Navbar';
import { Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';

const SearchPage = () => {
    const [activeTab, setActiveTab] = useState("movie");
    const [searchTerm, setSearchTerm] = useState("");

    const [results, setResults] = useState([]);
    const { contentType, setContentType } = useContentStore();

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        tab === "movie" ? setContentType("movie") : setContentType("tv");
        setResults([]);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`/api/v1/search/${activeTab}/${searchTerm}`);
            setResults(response.data.content);
        } catch (error) {
            if (error.response.status === 404) {
                toast.error("Nothing found, make sure you are search under the right category")
            }
            else {
                toast.error("Something went wrong");
            }
        }
    };

    console.log(results);
    

    return (
    <div className='bg-black min-h-screen text-white'>
        <Navbar/>
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center gap-3 mb-4">
                <button onClick={() => handleTabClick("movie")} className={`py-2 px-4 rounded ${activeTab === "movie" ? "bg-red-600" : "bg-gray-600"} hover:bg-red-700`}>
                    Movies
                </button>
                <button onClick={() => handleTabClick("tv")} className={`py-2 px-4 rounded ${activeTab === "tv" ? "bg-red-600" : "bg-gray-600"} hover:bg-red-700`}>
                    TV Shows
                </button>
                <button onClick={() => handleTabClick("person")} className={`py-2 px-4 rounded ${activeTab === "person" ? "bg-red-600" : "bg-gray-600"} hover:bg-red-700`}>
                    Person
                </button>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 items-stretch mb-8 max-w-2xl mx-auto">
                <input 
                type="text" 
                className="rounded w-full p-2 bg-gray-800 text-white"
                value={searchTerm} 
                placeholder={'Search for a ' + activeTab}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="rounded bg-red-600 hover:bg-red-700 p-2 text-white">
                    <Search className='size-6'/>
                </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((result) => {
                    if(!result.poster_path && !result.profile_path) return null;
                    return (
                        <div className="bg-gray-800 p-4 rounded" key={result.id}>
                            {activeTab === "person" ? (
                                <div className="flex flex-col items-center">
                                    <img
                                        src={ORIGINAL_IMG_BASE_URL + result.profile_path}
                                        alt={result.name}
                                        className='rounded mx-auto max-h-96'
                                    />
                                    <h2 className="mt-2 text-xl font-bold">
                                        {result.name}
                                    </h2>
                                </div>
                            ) : (
                                <Link to={"/watch/" + result.id} onClick={() => setContentType(activeTab)} className="flex flex-col items-center">
                                    <img
                                        src={ORIGINAL_IMG_BASE_URL + result.poster_path}
                                        alt={result.title || result.name}
                                        className='rounded h-auto w-full'
                                    />
                                    <h2 className="mt-2 text-xl font-bold">
                                        {result.title || result.name}
                                    </h2>
                                </Link>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default SearchPage