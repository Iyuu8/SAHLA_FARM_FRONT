import React from 'react'

export default function LoginFeatureContainer({ title, description, Icon, size, colors }) {
  const {bg,icon} = colors;
  return (
    <div className={`flex gap-2.5 px-[clamp(5px,0.5vw,12px)] py-[8px] rounded-[8px] text-white`} style={{backgroundColor: bg}}>
      <div className={`text-3xl flex items-center pl-[clamp(6px,1vw,20px)] pr-[clamp(8px,1.1vw,22px)] rounded-[5px] aspect-square`} style={{backgroundColor:icon}}>
        <Icon />
      </div>
      <div className='flex flex-col'>
        <h2 className='font-bold text-[clamp(13px,1.7vw,23px)]'>{title}</h2>
        <p className='text-[rgba(255,255,255,0.8)] text-[clamp(10px,1.1vw,18px)]'>{description}</p>
      </div>
    </div>
  )
}