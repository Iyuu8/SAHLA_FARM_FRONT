import React from 'react'

export default function Tooltip({title}) {
  return (
    <div className='bg-gray-100 opacity-70 text-black text-xs font-medium
      px-3 py-1 rounded-md whitespace-nowrap'
      
      >
        
      {title}
    </div>
  )
}
