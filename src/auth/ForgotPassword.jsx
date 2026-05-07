import React, { useState,useEffect } from 'react'
import { FaRegEnvelope, FaArrowLeft } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Bot, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LoginFeatureContainer from '../utilities/components/login/loginFeature'
import LanguageSwitcher from '../utilities/components/login/LanguageSwitcher'

export default function ForgotPassword() {
  const { t , i18n} = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail')
    if (rememberedEmail) {
      setEmail(rememberedEmail)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        data: {
            language: i18n.language || "english"  // or "en", "fr"
        },
        redirectTo: `${window.location.origin}/reset-password`,
      })

      console.log(' ************ the language:', i18n.language, 'email sent to:', email, 'error:', resetError);

      if (resetError) {
        // Handle rate limiting
        if (resetError.message.includes('rate limit')) {
          setCooldown(60)
          throw new Error(t('forgotPassword.rateLimitError'))
        }
        throw resetError
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message)
      console.log('Error sending password reset email:', err);
    } finally {
      setLoading(false)
    }
  }

  // Cooldown timer
  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const SmartAutomationIcon = () => <Bot size={38} />
  const UnifiedPlatformIcon = () => <Phone size={28} />

  if (success) {
    return (
      <div className='flex min-h-screen bg-[#F8FFF6] items-center justify-center'>
        <div className='text-center max-w-md mx-auto p-8'>
          <div className='bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6'>
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>{t('forgotPassword.checkEmail')}</h2>
          <p className='text-gray-600 mb-4'>
            {t('forgotPassword.sentLink')} <strong>{email}</strong>
          </p>
          <p className='text-sm text-gray-500 mb-6'>
            {t('forgotPassword.expireNotice')}
          </p>
          <Link 
            to='/login' 
            className='inline-flex items-center gap-2 text-[#55BB33] hover:underline'
          >
            <FaArrowLeft size={14} />
            {t('forgotPassword.backToLogin')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen bg-[#F8FFF6] font-newblack'>
      <LanguageSwitcher />
      {/* left side */}
      <div className='flex flex-col w-full laptop:w-1/2 justify-between h-screen min-h-screen'>
        <div className='flex flex-col items-center justify-center flex-1'>
          <div className='w-full max-w-md mx-auto p-8'>
            {/* <Link to='/login' className='inline-flex items-center gap-2 text-gray-600 hover:text-[#55BB33] mb-8'>
              <FaArrowLeft size={14} />
              Back to Login
            </Link> */}

            <div className='text-center mb-8'>
              <h1 className='font-bold text-black text-3xl mb-2'>{t('forgotPassword.title')}</h1>
              <p className='text-[#636364]'>
                {t('forgotPassword.description')}
              </p>
            </div>

            {error && (
              <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
              <label className='flex flex-col items-start gap-2'>
                <h2 className='text-[#444] font-medium'>{t('forgotPassword.emailLabel')}</h2>
                <div className='flex border-2 rounded-lg border-[#D9D9D9] px-4 items-center w-full'>
                  <span className='text-[#929292]'><FaRegEnvelope /></span>
                  <input
                    type='email'
                    className='outline-none text-[#444444] px-3 py-2 bg-transparent w-full'
                    placeholder='you@example.com'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </label>

              <button
                type='submit'
                disabled={loading || cooldown > 0}
                className='w-full bg-[#55BB33] text-white py-3 rounded-lg font-bold hover:bg-[#66cd43] transition disabled:opacity-50'
              >
                {loading ? t('forgotPassword.sending') : 
                 cooldown > 0 ? t('forgotPassword.wait', { seconds: cooldown }) : t('forgotPassword.sendResetLink')}
              </button>
            </form>

            <p className='text-center text-gray-600 mt-6'>
              {t('forgotPassword.rememberPassword')}{' '}
              <Link to='/login' className='text-[#55BB33] font-bold hover:underline'>
                {t('forgotPassword.signIn')}
              </Link>
            </p>
          </div>
        </div>

      </div>

      {/* right side */}
      <div className='min-h-screen hidden laptop:flex laptop:w-1/2 bg-gradient-to-br from-[#C0E0B8] to-[#60BF40] flex-col justify-between'>
        <div className='px-8 pt-6'>
          <h1 className='text-white text-3xl font-bold'>SAHLA FARM</h1>
        </div>
        <div className='w-full flex justify-center'>
          <img src='/SAHLA_logo.png' alt={t('forgotPassword.logoAlt')} className='w-64' />
        </div>
        <div className='px-8 pb-8'>
          <h1 className='text-white font-bold text-4xl mb-4'>{t('forgotPassword.rightSideTitle')}</h1>
          <p className='text-white text-lg'>{t('forgotPassword.rightSideDesc')}</p>
        </div>
        <div className='flex w-full justify-between px-8 py-6 gap-4'>
          <LoginFeatureContainer
            title={t('forgotPassword.feature1Title')}
            description={t('forgotPassword.feature1Desc')}
            Icon={SmartAutomationIcon}
            size={10}
            colors={{ bg: 'rgba(215,255,202,0.6)', icon: 'rgba(46,105,0,0.27)' }}
          />
          <LoginFeatureContainer
            title={t('forgotPassword.feature2Title')}
            description={t('forgotPassword.feature2Desc')}
            Icon={UnifiedPlatformIcon}
            size={10}
            colors={{ bg: 'rgba(215,255,202,0.6)', icon: 'rgba(46,105,0,0.27)' }}
          />
        </div>
      </div>
    </div>
  )
}