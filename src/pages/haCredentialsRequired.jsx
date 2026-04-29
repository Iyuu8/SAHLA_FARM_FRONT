import { Link } from 'react-router'
import { useTranslation } from 'react-i18next';

export default function HACredentialsRequired() {
  const { t } = useTranslation();
  return (
    <div className='w-full h-full flex-1 bg-[#F5F7F6] font-newblack flex items-center justify-center px-4 sm:px-6 py-6'>
      <div className='w-full max-w-2xl rounded-2xl border border-[#D9D9D9] bg-white shadow-sm p-8 md:p-12 text-center'>
        <p className='text-[#55BB33] font-bold text-sm tracking-wide'>{t('setup.required')}</p>
        <h1 className='mt-2 text-[#1A3D00] text-2xl md:text-4xl font-bold'>
          {t('setup.title')}
        </h1>
        <p className='mt-4 text-[#636364] text-base md:text-lg'>
          {t('setup.description')}
        </p>
        <div className='mt-8'>
          <Link
            to='/settings'
            className='inline-flex bg-[#55BB33] hover:bg-[#66cd43] text-white font-bold rounded-lg px-6 py-3 transition-all duration-300'
          >
            {t('setup.button')}
          </Link>
        </div>
      </div>
    </div>
  )
}
