import React, { useEffect } from 'react'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import { SMALL_IMG_BASE_URL } from '../utils/constants'
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

function formatDate(dateString) {
  const date = new Date(dateString);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  return `${month} ${day}, ${year}`;
}

const HistoryPage = () => {
  const [searchHistory , setSearchHistory] = useState([])

  useEffect(() => {
    const getSearchHistory = async () => {
      try {
        const res = await axios.get(`/api/v1/search/history`);
        setSearchHistory(res.data.content);
        
      } catch (error) {
        console.log(error.message);
        setSearchHistory([]);
      }
    }

    getSearchHistory();
  }, [])

  console.log(searchHistory);
  
  const handleDelete = async (entry) => {
    try {
      await axios.delete(`/api/v1/search/history/${entry.id}`);
      setSearchHistory(searchHistory.filter((item) => item.id !== entry.id));
    } catch (error) {
      toast.error("Failed to delete search item");
    }
  }

  if(searchHistory?.length === 0) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar/>
        <div className="mx-auto px-4 py-8 max-w-6xl">
          <h1 className="font-bold text-3xl mb-8">
            Search History
          </h1>
          <div className="flex justify-center items-center h-96">
            <p className="text-xl">
              You have no search history
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-black min-h-screen text-white'>
      <Navbar/>

      <div className="mx-auto  max-w-6xl px-4 py-8">
        <h1 className="text-3xl mb-8 font-bold">
          Search History
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {
            searchHistory?.map((entry) => (
              <div key={entry.id} className="bg-gray-800 p-4 rounded flex items-start">
                <img src={SMALL_IMG_BASE_URL + entry.image} alt="imaage" className='size-16 rounded-full object-cover mr-4' />
                <div className="flex flex-col">
                  <span className="text-white text-lg">
                    {entry.title}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {formatDate(entry.createdAt)}
                  </span>
                </div>

                <span className={`py-1 px-3 text-center min-w-20 rounded-full text-sm ml-auto ${entry.searchType === "Movie" ? "bg-red-600" : entry.searchType === "tv" ? "bg-blue-600" : "bg-green-600"}`}>
                  {entry.searchType[0].toUpperCase() + entry.searchType.slice(1)}
                </span>
                <Trash className='size-5 cursor-pointer ml-4 hover:fill-red-600 hover:text-red-600' onClick={() => handleDelete(entry)}/>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default HistoryPage