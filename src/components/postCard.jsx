import React from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage }) {
  console.log('PostCard rendered with:', { $id, title, featuredImage });
  
  const getImageSrc = () => {
    if (!featuredImage) {
      console.log('No featuredImage provided');
      return null;
    }
    
    const preview = appwriteService.getFilePreview(featuredImage);
    if (!preview) {
      console.log('No preview generated for fileId:', featuredImage);
      return null;
    }
    
    // Appwrite getFilePreview now returns a string URL directly
    const imageUrl = preview;
    console.log('Image URL:', imageUrl);
    console.log('Image URL type:', typeof imageUrl);
    return imageUrl;
  };
  
  const imageSrc = getImageSrc();
  
  return (
    <Link to={`/post/${$id}`} className="block group">
        <div className='w-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1'>
            <div className='w-full overflow-hidden'>
                {imageSrc ? (
                  <>
                    <img 
                      src={imageSrc} 
                      alt={title}
                      className='w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300'
                      onError={(e) => {
                        console.error('Image failed to load:', e);
                        console.log('Failed image src:', e.target.src);
                        e.target.style.display = 'none';
                        // Find and show the fallback div
                        const fallback = e.target.nextElementSibling;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }} 
                    />
                    <div className="text-gray-500 bg-gray-100 w-full h-48 sm:h-56 md:h-64 flex items-center justify-center" style={{display: 'none'}}>
                      <div className="text-center">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs sm:text-sm font-medium">Image failed to load</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-full h-48 sm:h-56 md:h-64 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500 text-sm sm:text-base font-medium">No image available</p>
                    </div>
                  </div>
                )}
            </div>
            <div className='p-4 sm:p-6'>
                <h2 className='text-lg sm:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2'>{title}</h2>
                <div className="mt-3 sm:mt-4 flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs sm:text-sm">Read more</span>
                </div>
            </div>
        </div>
    </Link>
  )
}

export default PostCard;
