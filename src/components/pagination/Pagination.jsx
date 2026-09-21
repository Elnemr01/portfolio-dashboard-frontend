import React from 'react'

const Pagination = ({response, page,setFun,name}) => {
    return (
        <div className="butns flex justify-between mt-2 p-4">
            {<button onClick={()=> setFun(old => old-1)} type="button" 
                className={`text-white bg-indigo-600 w-fit p-4 rounded-full py-2  ${page <= 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}>
                previous
            </button> }
            { <button 
            className={`text-white bg-indigo-600 w-fit p-4 rounded-full py-2
                ${response?.data?.[name].length == 0 ?'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
            onClick={()=> setFun(old => old+1)} type="button">
                next
            </button>}
        </div>
    )
}

export default Pagination