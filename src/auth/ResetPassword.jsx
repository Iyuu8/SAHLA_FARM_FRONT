import React, { useState, useEffect } from 'react'
import { FaEye, FaLock } from 'react-icons/fa6'
import { FaCheckCircle } from 'react-icons/fa' // Import from 'react-icons/fa' instead
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Bot, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LoginFeatureContainer from '../utilities/components/login/loginFeature'
import LanguageSwitcher from '../utilities/components/login/LanguageSwitcher'
import {translateText} from '../utilities/functions/translateText'

export default function ResetPassword() {
  const { t, i18n } = useTranslation()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const navigate = useNavigate()

  // Validate password strength
  const validatePassword = (value) => {
    if (value && value.length < 8) {
      setPasswordError(t('resetPassword.passwordLengthError'))
      return false
    } else {
      setPasswordError('')
      return true
    }
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    validatePassword(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validatePassword(password)) {
      setError(t('resetPassword.invalidPasswordError'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('resetPassword.passwordsMatchError'))
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) throw updateError

      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      const translatedMessage = await translateText(err.message, i18n.language)
      setError(translatedMessage)
    } finally {
      setLoading(false)
    }
  }

  const SmartAutomationIcon = () => <Bot size={38} />
  const UnifiedPlatformIcon = () => <Phone size={28} />

  if (success) {
    return (
      <div className='flex min-h-screen bg-[#F8FFF6] items-center justify-center'>
        <div className='text-center max-w-md mx-auto p-8'>
          <div className='bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6'>
            <FaCheckCircle className='w-10 h-10 text-green-600' />
          </div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>{t('resetPassword.successTitle')}</h2>
          <p className='text-gray-600 mb-4'>
            {t('resetPassword.successMessage')}
          </p>
          <p className='text-sm text-gray-500'>
            {t('resetPassword.redirectingMessage')}
          </p>
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
            <div className='text-center mb-8'>
              <h1 className='font-bold text-black text-3xl mb-2'>{t('resetPassword.title')}</h1>
              <p className='text-[#636364]'>
                {t('resetPassword.subtitle')}
              </p>
            </div>

            {error && (
              <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
              <label className='flex flex-col items-start gap-2'>
                <h2 className='text-[#444] font-medium'>{t('resetPassword.newPasswordLabel')}</h2>
                <div className={`flex border-2 rounded-lg px-4 items-center w-full ${
                  passwordError ? 'border-red-500' : 'border-[#D9D9D9]'
                }`}>
                  <span className='text-[#929292]'><FaLock /></span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className='outline-none text-[#444444] px-3 py-2 bg-transparent w-full'
                    placeholder={t('resetPassword.newPasswordPlaceholder')}
                    required
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type='button'
                    className='text-[#48a32a] cursor-pointer'
                    onClick={() => setShowPass(!showPass)}
                  >
                    <FaEye />
                  </button>
                </div>
                {passwordError && (
                  <p className='text-red-500 text-xs mt-1'>{passwordError}</p>
                )}
                {!passwordError && password && (
                  <p className='text-green-500 text-xs mt-1'>{t('resetPassword.passwordValid')}</p>
                )}
              </label>

              <label className='flex flex-col items-start gap-2'>
                <h2 className='text-[#444] font-medium'>{t('resetPassword.confirmPasswordLabel')}</h2>
                <div className='flex border-2 rounded-lg border-[#D9D9D9] px-4 items-center w-full'>
                  <span className='text-[#929292]'><FaLock /></span>
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    className='outline-none text-[#444444] px-3 py-2 bg-transparent w-full'
                    placeholder={t('resetPassword.confirmPasswordPlaceholder')}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type='button'
                    className='text-[#48a32a] cursor-pointer'
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                  >
                    <FaEye />
                  </button>
                </div>
              </label>

              <button
                type='submit'
                disabled={loading || !!passwordError}
                className='w-full bg-[#55BB33] text-white py-3 rounded-lg font-bold hover:bg-[#66cd43] transition disabled:opacity-50'
              >
                {loading ? t('resetPassword.resettingButton') : t('resetPassword.resetButton')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* right side */}
      <div className='min-h-screen hidden laptop:flex laptop:w-1/2 bg-gradient-to-br from-[#C0E0B8] to-[#60BF40] flex-col justify-between'>
        <div className='px-8 pt-6'>
          <h1 className='text-white text-3xl font-bold'>SAHLA FARM</h1>
        </div>
        <div className='w-full flex justify-center'>
          <img src='/SAHLA_logo.png' alt={t('resetPassword.logoAlt')} className='w-64' />
        </div>
        <div className='px-8 pb-8'>
          <h1 className='text-white font-bold text-4xl mb-4'>{t('resetPassword.rightSideTitle')}</h1>
          <p className='text-white text-lg'>{t('resetPassword.rightSideDesc')}</p>
        </div>
        <div className='flex w-full justify-between px-8 py-6 gap-4'>
          <LoginFeatureContainer
            title={t('resetPassword.feature1Title')}
            description={t('resetPassword.feature1Desc')}
            Icon={SmartAutomationIcon}
            size={10}
            colors={{ bg: 'rgba(215,255,202,0.6)', icon: 'rgba(46,105,0,0.27)' }}
          />
          <LoginFeatureContainer
            title={t('resetPassword.feature2Title')}
            description={t('resetPassword.feature2Desc')}
            Icon={UnifiedPlatformIcon}
            size={10}
            colors={{ bg: 'rgba(215,255,202,0.6)', icon: 'rgba(46,105,0,0.27)' }}
          />
        </div>
      </div>
    </div>
  )
}