import React, { useState, useRef, useEffect } from 'react'
import {
  FaCalendar,
  FaEye,
  FaLock,
  FaLocationDot,
  FaRegEnvelope,
  FaUser,
} from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { FaExclamationCircle } from 'react-icons/fa'
import { Bot, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LoginFeatureContainer from '../utilities/components/login/loginFeature'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import LanguageSwitcher from '../utilities/components/login/LanguageSwitcher'

export default function SignUp() {
  const { t , i18n} = useTranslation()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [age, setAge] = useState('')
  const [address, setAddress] = useState('')
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [emailError, setEmailError] = useState('')
  

  const validatePassword = (value) => {
    if (value.length > 0 && value.length < 8) {
      setPasswordError(t('signUp.passwordLengthError'))
      return false
    } else {
      setPasswordError('')
      return true
    }
  }

  const checkEmailExists = async (value) => {
    if (!value) return
    try {
      const { data } = await supabase
        .from('users')
        .select('id')
        .eq('email', value)
        .single()

      if (data) {
        setEmailError(t('signUp.emailExistsError'))
        return true
      } else {
        setEmailError('')
        return false
      }
    } catch {
      setEmailError('')
      return false
    }
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    validatePassword(value)
  }

  const handleEmailChange = async (e) => {
    const value = e.target.value
    setEmail(value)
    if (value) {
      await checkEmailExists(value)
    } else {
      setEmailError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validatePassword(password)) {
      setError(t('signUp.fixErrors'))
      return
    }

    const emailExists = await checkEmailExists(email)
    if (emailExists) {
      setError(t('signUp.emailExistsError'))
      return
    }

    setLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            age: age,
            language: i18n.language || "english"  // or "en", "fr"
          },
          emailRedirectTo: window.location.origin + '/login',
        },
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          throw new Error(t('signUp.emailExistsError'))
        } else if (signUpError.message.includes('password')) {
          throw new Error(t('signUp.passwordLengthError'))
        } else {
          throw signUpError
        }
      }

      // Store user data — will be sent to backend after email confirmation
      /* pendingSetup.current = {
        username,
        age: parseInt(age),
        address,
        email,
      } */
      localStorage.setItem('pendingSetup', JSON.stringify({
        username,
        age: parseInt(age),
        address,
        email,
        language: i18n.language || "english",
      }))
      

      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000); 
    } catch (err) {
      setError(err.message)
      setSuccess(false)
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
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>{t('signUp.successTitle')}</h2>
          <p className='text-gray-600 mb-4'>
            {t('signUp.successMessage')} <strong>{email}</strong>
          </p>
          <p className='text-sm text-gray-500'>
            {t('signUp.redirectingMessage')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen bg-[#F8FFF6] font-newblack'>
      <LanguageSwitcher />
      {/* left side */}
      <div className='flex flex-col w-full laptop:w-1/2 justify-between h-screen min-h-screen pt-[clamp(14px,2.6vh,34px)] pb-[clamp(8px,1.2vh,18px)] single-short:pt-[10px] single-short:pb-[6px] single-tall:pt-[44px] single-tall:pb-[22px] single-taller:pt-[54px] single-taller:pb-[28px]'>
        <div className='flex flex-col items-center justify-center flex-[0.75] min-h-[clamp(90px,12vh,170px)] gap-[clamp(4px,0.8vh,10px)] single-short:min-h-[82px] single-short:gap-[4px] single-tall:min-h-[190px] single-tall:gap-[10px] single-taller:min-h-[220px] single-taller:gap-[12px]'>
          <h1 className='font-bold text-black text-[28px] xs:text-[30px] md:text-[34px] laptop:text-[36px] single-tall:text-[40px] single-taller:text-[45px] text-center'>{t('signUp.title')}</h1>
          <p className='text-[#636364] font-normal text-[15px] xs:text-[16px] md:text-[18px] laptop:text-[20px] single-tall:text-[23px] single-taller:text-[26px] text-center px-4'>{t('signUp.subtitle')}</p>
        </div>

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto w-[80%] xs:w-[70%] mb-4'>
            <span className='block sm:inline'>{error}</span>
          </div>
        )}

        <form
          className='flex items-center justify-center flex-[1.5] gap-[clamp(8px,1.2vh,14px)] flex-col mt-[clamp(4px,1vh,12px)] min-h-[clamp(360px,52vh,500px)] single-short:min-h-[350px] single-short:gap-[7px] single-short:mt-[4px] single-tall:min-h-[700px] single-tall:gap-[12px] single-tall:mt-[12px] single-taller:min-h-[790px] single-taller:gap-[14px] single-taller:mt-[16px]'
          onSubmit={handleSubmit}
        >
          <label className='flex flex-col items-start w-[80%] xs:w-[70%] gap-[4px]'>
            <h2 className='text-[#444] font-medium font-family-poppins w-full text-[14px] md:text-[15px] single-tall:text-[20px] single-taller:text-[22px]'>{t('signUp.usernameLabel')}</h2>
            <div className='flex border-2 rounded-[10px] border-[#D9D9D9] px-4 items-center py-[1px] w-full min-h-[40px] single-tall:min-h-[66px] single-tall:py-[8px] single-taller:min-h-[74px] single-taller:py-[10px]'>
              <span className='font-light text-[22px] single-tall:text-[33px] single-taller:text-[36px] text-[#929292]'><FaUser /></span>
              <input
                name='username'
                type='text'
                className='outline-none text-[clamp(1.3ch,1.7vw,2ch)] single-tall:text-[2.4ch] single-taller:text-[2.65ch] text-[#444444] px-[10px] py-[2px] bg-transparent max-w-[90%]'
                placeholder={t('signUp.usernamePlaceholder')}
                required
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>
          </label>

          <label className='flex flex-col items-start w-[80%] xs:w-[70%] gap-[4px]'>
            <h2 className='text-[#444] font-medium font-family-poppins w-full text-[14px] md:text-[15px] single-tall:text-[20px] single-taller:text-[22px]'>{t('signUp.emailLabel')}</h2>
            <div className={`flex border-2 rounded-[10px] px-4 items-center py-[1px] w-full min-h-[40px] single-tall:min-h-[66px] single-tall:py-[8px] single-taller:min-h-[74px] single-taller:py-[10px] ${emailError ? 'border-red-500' : 'border-[#D9D9D9]'}`}>
              <span className='font-light text-[22px] single-tall:text-[33px] single-taller:text-[36px] text-[#929292]'><FaRegEnvelope /></span>
              <input
                name='email'
                type='email'
                className='outline-none text-[clamp(1.3ch,1.7vw,2ch)] single-tall:text-[2.4ch] single-taller:text-[2.65ch] text-[#444444] px-[10px] py-[2px] bg-transparent max-w-[80%]'
                placeholder='you@example.com'
                required
                onChange={handleEmailChange}
                value={email}
              />
            </div>
            {emailError && <p className='text-red-500 text-xs mt-1'>{emailError}</p>}
          </label>

          <label className='flex flex-col items-start w-[80%] xs:w-[70%] gap-[4px]'>
            <h2 className='text-[#444] font-medium font-family-poppins w-full text-[14px] md:text-[15px] single-tall:text-[20px] single-taller:text-[22px]'>{t('signUp.passwordLabel')}</h2>
            <div className={`flex border-2 rounded-[10px] px-4 items-center py-[1px] w-full min-h-[40px] single-tall:min-h-[66px] single-tall:py-[8px] single-taller:min-h-[74px] single-taller:py-[10px] ${passwordError ? 'border-red-500' : 'border-[#D9D9D9]'}`}>
              <span className='font-light text-[22px] single-tall:text-[32px] single-taller:text-[35px] text-[#929292]'><FaLock /></span>
              <input
                name='password'
                type={showPass ? 'text' : 'password'}
                className='outline-none text-[clamp(1.3ch,1.7vw,2ch)] single-tall:text-[2.4ch] single-taller:text-[2.65ch] text-[#444444] px-[10px] py-[2px] bg-transparent max-w-[80%]'
                placeholder={t('signUp.passwordPlaceholder')}
                required
                onChange={handlePasswordChange}
                value={password}
              />
              <button
                type='button'
                className='ml-auto text-[#48a32a] text-[22px] single-tall:text-[32px] single-taller:text-[35px] cursor-pointer'
                onClick={() => setShowPass(!showPass)}
              ><FaEye /></button>
            </div>
            {passwordError && <p className='text-red-500 text-xs mt-1'>{passwordError}</p>}
            {!passwordError && password && <p className='text-green-500 text-xs mt-1'>{t('signUp.passwordValid')}</p>}
          </label>

          <div className='w-[80%] xs:w-[70%] grid grid-cols-[35fr_65fr] gap-2 single-tall:gap-3 single-taller:gap-4'>
            <label className='flex flex-col items-start gap-[4px] min-w-0'>
              <h2 className='text-[#444] font-medium font-family-poppins w-full text-[14px] md:text-[15px] single-tall:text-[20px] single-taller:text-[22px]'>{t('signUp.ageLabel')}</h2>
              <div className='flex border-2 rounded-[10px] border-[#D9D9D9] px-3 items-center py-[1px] w-full min-h-[40px] single-tall:min-h-[66px] single-tall:py-[8px] single-taller:min-h-[74px] single-taller:py-[10px]'>
                <span className='font-light text-[20px] single-tall:text-[30px] single-taller:text-[33px] text-[#929292]'><FaCalendar /></span>
                <input
                  name='age'
                  type='number'
                  className='outline-none text-[clamp(1.1ch,1.3vw,1.6ch)] single-tall:text-[1.95ch] single-taller:text-[2.2ch] text-[#444444] px-[8px] py-[2px] bg-transparent w-full min-w-0'
                  placeholder={t('signUp.agePlaceholder')}
                  required
                  min={1}
                  max={150}
                  onChange={(e) => setAge(e.target.value)}
                  value={age}
                />
              </div>
            </label>

            <label className='flex flex-col items-start gap-[4px] min-w-0'>
              <h2 className='text-[#444] font-medium font-family-poppins w-full text-[14px] md:text-[15px] single-tall:text-[20px] single-taller:text-[22px]'>{t('signUp.addressLabel')}</h2>
              <div className='flex border-2 rounded-[10px] border-[#D9D9D9] px-4 items-center py-[1px] w-full min-h-[40px] single-tall:min-h-[66px] single-tall:py-[8px] single-taller:min-h-[74px] single-taller:py-[10px]'>
                <span className='font-light text-[22px] single-tall:text-[33px] single-taller:text-[36px] text-[#929292]'><FaLocationDot /></span>
                <input
                  name='address'
                  type='text'
                  className='outline-none text-[clamp(1.3ch,1.7vw,2ch)] single-tall:text-[2.4ch] single-taller:text-[2.65ch] text-[#444444] px-[10px] py-[2px] bg-transparent w-full min-w-0'
                  placeholder={t('signUp.addressPlaceholder')}
                  required
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                />
              </div>
            </label>
          </div>

          <div className='w-[85%] xs:w-[70%] flex justify-center mb-[clamp(4px,1vh,10px)] mt-[clamp(4px,1vh,12px)] flex-col items-center gap-[clamp(5px,0.8vh,10px)] single-tall:mt-[16px] single-tall:mb-[16px] single-tall:gap-[12px] single-taller:mt-[20px] single-taller:mb-[18px] single-taller:gap-[14px]'>
            <button
              type='submit'
              disabled={loading || !!passwordError || !!emailError}
              className='bg-[#55BB33] w-[90%] xs:w-[80%] py-[6px] single-tall:py-[13px] single-taller:py-[16px] rounded-[6px] font-bold text-white font-family-poppins cursor-pointer transition-all duration-300 hover:bg-[#66cd43] md:text-[20px] text-[18px] single-tall:text-[28px] single-taller:text-[31px] shadow-sm shadow-[#55BB33] disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? t('signUp.creatingButton') : t('signUp.createButton')}
            </button>
            <Link to='/login' className='font-bold underline text-[#1A3D00] text-center text-[13px] md:text-[14px] single-tall:text-[19px] single-taller:text-[21px]'>{t('signUp.signInLink')}</Link>
          </div>
        </form>

        {/* demo mode notice */}
        <div className='flex justify-center mt-[clamp(6px,1.1vh,18px)] max-w-[84%] self-center flex-[0.85] items-center min-h-[clamp(96px,14vh,220px)] single-short:min-h-[84px] single-tall:min-h-[210px] single-taller:min-h-[250px]'>
          <div className='bg-[#dcecd0] rounded-xl border-[#D9D9D9] px-[20px] py-[15px] single-short:px-[14px] single-short:py-[10px] single-tall:px-[30px] single-tall:py-[24px] single-taller:px-[36px] single-taller:py-[30px] text-[#3e9322]'>
            <div className='flex items-center gap-2'>
              <FaExclamationCircle className='w-10 text-2xl single-tall:text-[30px] single-taller:text-[34px]' />
              <span className='font-medium single-tall:text-[28px] single-taller:text-[31px]'>{t('signUp.demoModeTitle')}</span>
            </div>
            <p className='mt-1 text-sm single-short:text-[12px] single-tall:text-[20px] single-taller:text-[22px] text-[#3b8622] text-center'>
              {t('signUp.demoModeDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <div className='min-h-screen hidden laptop:flex laptop:w-1/2 bg-gradient-to-br from-[#C0E0B8] to-[#60BF40] flex-col justify-between'>
        <div className='px-[20px] pt-[15px]'>
          <h1 className='text-[white] text-3xl font-bold font-newblack'>SAHLA FARM</h1>
        </div>
        <div className='w-full flex justify-center'>
          <img src='/SAHLA_logo.png' alt={t('signUp.logoAlt')} className='w-[280px]' />
        </div>
        <div className='flex flex-col gap-[clamp(10px,1vh,15px)] mt-[clamp(20px,5vh,70px)] px-[clamp(20px,2.5vw,60px)]'>
          <h1 className='text-white font-bold text-[45px] leading-[3rem] font-newblack'>{t('signUp.rightSideTitle')}</h1>
          <p className='text-white font-semibold text-[16px] font-newblack'>{t('signUp.rightSideDesc')}</p>
        </div>
        <div className='flex w-full justify-between px-[clamp(15px,1.5vw,60px)] py-[clamp(10px,2vh,30px)] gap-2'>
          <LoginFeatureContainer
            title={t('signUp.feature1Title')}
            description={t('signUp.feature1Desc')}
            Icon={SmartAutomationIcon}
            size={10}
            colors={{ bg: 'rgba(215,255,202,0.6)', icon: 'rgba(46,105,0,0.27)' }}
          />
          <LoginFeatureContainer
            title={t('signUp.feature2Title')}
            description={t('signUp.feature2Desc')}
            Icon={UnifiedPlatformIcon}
            size={10}
            colors={{ bg: 'rgba(215,255,202,0.6)', icon: 'rgba(46,105,0,0.27)' }}
          />
        </div>
      </div>
    </div>
  )
}