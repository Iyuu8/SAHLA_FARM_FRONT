import { Link } from 'react-router'

export default function HACredentialsRequired() {
  return (
    <div className='w-full h-full flex-1 bg-[#F5F7F6] font-newblack flex items-center justify-center px-4 sm:px-6 py-6'>
      <div className='w-full max-w-2xl rounded-2xl border border-[#D9D9D9] bg-white shadow-sm p-8 md:p-12 text-center'>
        <p className='text-[#55BB33] font-bold text-sm tracking-wide'>SETUP REQUIRED</p>
        <h1 className='mt-2 text-[#1A3D00] text-2xl md:text-4xl font-bold'>
          Home Assistant URL/Token Missing
        </h1>
        <p className='mt-4 text-[#636364] text-base md:text-lg'>
          Please add your Home Assistant URL and Long-Lived Access Token in Settings before using this page.
        </p>
        <div className='mt-8'>
          <Link
            to='/settings'
            className='inline-flex bg-[#55BB33] hover:bg-[#66cd43] text-white font-bold rounded-lg px-6 py-3 transition-all duration-300'
          >
            Go To Settings
          </Link>
        </div>
      </div>
    </div>
  )
}
