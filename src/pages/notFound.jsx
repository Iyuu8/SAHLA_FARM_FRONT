import { Link } from 'react-router'
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className='min-h-screen bg-[#F5F7F6] font-newblack flex items-center justify-center px-6'>
      <div className='w-full max-w-2xl rounded-2xl border border-[#D9D9D9] bg-white shadow-sm p-8 md:p-12 text-center'>
        <p className='text-[#55BB33] font-bold text-sm tracking-wide'>{t('notFound.error')}</p>
        <h1 className='mt-2 text-[#1A3D00] text-3xl md:text-5xl font-bold'>{t('notFound.title')}</h1>
        <p className='mt-4 text-[#636364] text-base md:text-lg'>
          {t('notFound.description')}
        </p>
        <div className='mt-8 flex items-center justify-center gap-3'>
          <Link
            to='/'
            className='bg-[#55BB33] hover:bg-[#66cd43] text-white font-bold rounded-lg px-6 py-3 transition-all duration-300'
          >
            {t('notFound.goDashboard')}
          </Link>
          <Link
            to='/settings'
            className='border border-[#55BB33] text-[#2E6900] hover:bg-[#EAF6E5] font-bold rounded-lg px-6 py-3 transition-all duration-300'
          >
            {t('notFound.openSettings')}
          </Link>
        </div>
      </div>
    </div>
  )
}
