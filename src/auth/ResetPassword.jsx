import React, { useState, useEffect } from 'react'
import { FaEye, FaLock } from 'react-icons/fa6'
import { FaCheckCircle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Bot, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LoginFeatureContainer from '../utilities/components/login/loginFeature'
import LanguageSwitcher from '../utilities/components/login/LanguageSwitcher'
//import { API_BASE } from '../config/api'
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000'
export default function ResetPassword() {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [accessToken, setAccessToken] = useState(null)
  const [verifying, setVerifying] = useState(true)
  const navigate = useNavigate()

  // ✅ Extract access token from URL fragment
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const token = hashParams.get('access_token')
    
    if (!token) {
      setError(t('resetPassword.missingTokenError') || 'Invalid or missing reset token. Please request a new reset link.')
      setVerifying(false)
      navigate('/login');
      return
    }
    
    setAccessToken(token)
    setVerifying(false)
  }, [navigate, t])

  const validatePassword = (value) => {
    if (value && value.length < 8) {
      setPasswordError(t('resetPassword.passwordLengthError') || 'Password must be at least 8 characters')
      return false
    }
    setPasswordError('')
    return true
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
      setError(t('resetPassword.invalidPasswordError') || 'Please enter a valid password')
      return
    }

    if (password !== confirmPassword) {
      setError(t('resetPassword.passwordsMatchError') || 'Passwords do not match')
      return
    }

    setLoading(true)

    try {
      // ✅ Call your backend endpoint with the token in Authorization header
      const response = await fetch(`${API_BASE}/api/auth/resetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          newPassword: password,
          confirmPassword: confirmPassword,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }

      setSuccess(true)
      
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      console.error('Reset password error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const SmartAutomationIcon = () => <Bot size={38} />
  const UnifiedPlatformIcon = () => <Phone size={28} />

  if (verifying) {
    return (
      <div className='flex min-h-screen bg-[#F8FFF6] items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#55BB33] mx-auto mb-4'></div>
          <p className='text-gray-600'>{t('resetPassword.verifyingMessage') || 'Verifying reset link...'}</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className='flex min-h-screen bg-[#F8FFF6] items-center justify-center'>
        <div className='text-center max-w-md mx-auto p-8'>
          <div className='bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6'>
            <FaCheckCircle className='w-10 h-10 text-green-600' />
          </div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>{t('resetPassword.successTitle') || 'Password Reset Successfully'}</h2>
          <p className='text-gray-600 mb-4'>
            {t('resetPassword.successMessage') || 'Your password has been changed.'}
          </p>
          <p className='text-sm text-gray-500'>
            {t('resetPassword.redirectingMessage') || 'Redirecting to login...'}
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
              <h1 className='font-bold text-black text-3xl mb-2'>{t('resetPassword.title') || 'Reset Password'}</h1>
              <p className='text-[#636364]'>
                {t('resetPassword.subtitle') || 'Enter your new password below'}
              </p>
            </div>

            {error && (
              <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
              <label className='flex flex-col items-start gap-2'>
                <h2 className='text-[#444] font-medium'>{t('resetPassword.newPasswordLabel') || 'New Password'}</h2>
                <div className={`flex border-2 rounded-lg px-4 items-center w-full ${
                  passwordError ? 'border-red-500' : 'border-[#D9D9D9]'
                }`}>
                  <span className='text-[#929292]'><FaLock /></span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className='outline-none text-[#444444] px-3 py-2 bg-transparent w-full'
                    placeholder={t('resetPassword.newPasswordPlaceholder') || 'Enter new password'}
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
                  <p className='text-green-500 text-xs mt-1'>{t('resetPassword.passwordValid') || '✓ Valid password'}</p>
                )}
              </label>

              <label className='flex flex-col items-start gap-2'>
                <h2 className='text-[#444] font-medium'>{t('resetPassword.confirmPasswordLabel') || 'Confirm Password'}</h2>
                <div className='flex border-2 rounded-lg border-[#D9D9D9] px-4 items-center w-full'>
                  <span className='text-[#929292]'><FaLock /></span>
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    className='outline-none text-[#444444] px-3 py-2 bg-transparent w-full'
                    placeholder={t('resetPassword.confirmPasswordPlaceholder') || 'Confirm new password'}
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
                {loading ? (t('resetPassword.resettingButton') || 'Resetting...') : (t('resetPassword.resetButton') || 'Reset Password')}
              </button>
            </form>

            <div className='text-center mt-6'>
              <Link to='/forgot-password' className='text-[#55BB33] hover:underline text-sm'>
                {t('resetPassword.requestNewLink') || 'Request new reset link'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* right side */}
      <div className='min-h-screen hidden laptop:flex laptop:w-1/2 bg-gradient-to-br from-[#C0E0B8] to-[#60BF40] flex-col justify-between'>
        <div className='px-8 pt-6'>
          <h1 className='text-white text-3xl font-bold'>SAHLA FARM</h1>
        </div>
        <div className='w-full flex justify-center'>
          <img src='/SAHLA_logo.png' alt={t('resetPassword.logoAlt') || 'Sahla Farm Logo'} className='w-64' />
        </div>
        <div className='px-8 pb-8'>
          <h1 className='text-white font-bold text-4xl mb-4'>{t('resetPassword.rightSideTitle') || 'Smart Farm Management'}</h1>
          <p className='text-white text-lg'>{t('resetPassword.rightSideDesc') || 'Monitor and control your farm from anywhere'}</p>
        </div>
        <div className='flex w-full justify-between px-8 py-6 gap-4'>
          <LoginFeatureContainer
            title={t('resetPassword.feature1Title') || 'Smart Automation'}
            description={t('resetPassword.feature1Desc') || 'Automate your farm operations'}
            Icon={SmartAutomationIcon}
            size={10}
            colors={{ bg: 'rgba(215,255,202,0.6)', icon: 'rgba(46,105,0,0.27)' }}
          />
          <LoginFeatureContainer
            title={t('resetPassword.feature2Title') || 'Unified Platform'}
            description={t('resetPassword.feature2Desc') || 'All your farm data in one place'}
            Icon={UnifiedPlatformIcon}
            size={10}
            colors={{ bg: 'rgba(215,255,202,0.6)', icon: 'rgba(46,105,0,0.27)' }}
          />
        </div>
      </div>
    </div>
  )
}