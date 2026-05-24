import React, { useState, useEffect } from 'react'
import { FaEye, FaLock, FaRegEnvelope } from 'react-icons/fa6'
import { Link } from 'react-router'
import { Bot, Phone } from 'lucide-react'
import LoginFeatureContainer from '../utilities/components/login/loginFeature'
import { useNavigate } from 'react-router'
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../utilities/components/login/LanguageSwitcher' 
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export default function Login() {
  const { t  , i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
          const pending = localStorage.getItem('pendingSetup')
          if (!pending) return

          // Remove immediately as the lock — prevents any other instance from running
          localStorage.removeItem('pendingSetup')

          const { username, age, address, email, language } = JSON.parse(pending)

          try {
            const res = await fetch(`${API_URL}/auth/signupSetup`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ username, age, address, email, language }),
            })

            const data = await res.json()
            console.log('signupSetup response:', data)
          } catch (err) {
            console.error('signupSetup failed:', err)
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error: signinError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (signinError) {
        // Handle specific error cases
        if (signinError.message.includes('Invalid login credentials')) {
          throw new Error(t('login.errors.invalidCredentials'));
        } else if (signinError.message.includes('Email not confirmed')) {
          throw new Error(t('login.errors.unverifiedEmail'));
        } else {
          throw new Error(t('login.errors.genericError'));
        };
      };
      if (data.session) {
        // Call loginSetup
        try {
          await fetch(`${API_URL}/auth/loginSetup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.session.access_token}`,
            },
          })
        } catch (err) {
          console.error('loginSetup failed:', err)
        }
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    console.log("the error is", error);
  }

  const handleRememberMeChange = () => {
    if (!rememberMe) {
      localStorage.removeItem('rememberedEmail');
    } else {
      localStorage.setItem('rememberedEmail', email);
    }
  }
  const SmartAutomationIcon = () => <Bot size={38} />;
  const UnifiedPlatformIcon = () => <Phone size={28} />;
 
  return (
    <div className='flex min-h-screen bg-[#F8FFF6] font-newblack'>
      <LanguageSwitcher />
      {/* left side */}
      <div className='relative flex flex-col w-full laptop:w-1/2 justify-start items-center h-screen min-h-screen pt-[12vh] pb-[clamp(10px,1.8vh,24px)] single-short:pt-[8vh] single-tall:pt-[15vh] single-taller:pt-[18vh]'>
        
        {/* Title Section */}
        <div className='flex flex-col items-center justify-center w-full gap-[clamp(6px,1.1vh,14px)] mb-6 single-short:mb-4 single-tall:mb-10 single-taller:mb-12'>
          <h1 className='font-bold text-black text-[28px] xs:text-[30px] md:text-[34px] laptop:text-[36px] single-tall:text-[42px] single-taller:text-[48px] text-center'>{t('login.welcomeBackTitle')}</h1>
          <p className='text-[#636364] font-normal text-[16px] xs:text-[18px] md:text-[20px] laptop:text-[23px] single-tall:text-[25px] single-taller:text-[28px] text-center px-4'>{t('login.welcomeBackSubtitle')}</p>
        </div>

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto w-[80%] mb-4'>
            {error}
          </div>
        )}

        {/* Form Section */}
        <form
          className='w-full flex items-center justify-start flex-col gap-[clamp(16px,2.4vh,34px)] single-short:gap-[12px] single-tall:gap-[34px] single-taller:gap-[40px]'
          onSubmit={handleSubmit}
        >
          {/* email */}
          <label className='flex flex-col items-start w-[80%] xs:w-[70%] gap-[clamp(4px,0.8vh,10px)]'>
            <h2 className='text-[#444] font-medium font-family-poppins w-full text-[16px] single-tall:text-[21px] single-taller:text-[23px]'>{t('login.emailLabel')}</h2>
            <div className='flex border-2 rounded-[10px] border-[#D9D9D9] px-5 items-center py-[clamp(3px,0.8vh,10px)] w-full min-h-[clamp(48px,6vh,76px)] single-short:min-h-[44px] single-short:py-[2px] single-tall:min-h-[84px] single-tall:py-[13px] single-taller:min-h-[96px] single-taller:py-[16px]'>
              <span className='font-light text-[30px] single-tall:text-[38px] single-taller:text-[42px] text-[#929292]'><FaRegEnvelope /></span>
              <input
                type="text"
                /* dir="ltr" */
                className='outline-none text-[clamp(1.5ch,2vw,2.2ch)] single-tall:text-[2.55ch] single-taller:text-[2.8ch] text-[#444444] px-[12px] py-[3px] bg-transparent w-full'
                placeholder='you@example.com'
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
          </label>
 
          {/* password */}
          <label className='flex flex-col items-start w-[80%] xs:w-[70%] gap-[clamp(4px,0.8vh,10px)]'>
            <h2 className='text-[#444] font-medium font-family-poppins w-full text-[16px] single-tall:text-[21px] single-taller:text-[23px]'>{t('login.passwordLabel')}</h2>
            <div className='flex border-2 rounded-[10px] border-[#D9D9D9] px-5 items-center py-[clamp(3px,0.8vh,10px)] w-full min-h-[clamp(48px,6vh,76px)] single-short:min-h-[44px] single-short:py-[2px] single-tall:min-h-[84px] single-tall:py-[13px] single-taller:min-h-[96px] single-taller:py-[16px]'>
              <span className='font-light text-[25px] single-tall:text-[36px] single-taller:text-[40px] text-[#929292]'><FaLock /></span>
              <input
                type={showPass ? "text" : "password"}
                className='outline-none text-[clamp(1.5ch,2vw,2.2ch)] single-tall:text-[2.55ch] single-taller:text-[2.8ch] text-[#444444] px-[12px] py-[3px] bg-transparent w-full'
                placeholder={t('login.passwordPlaceholder')}
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button
                type="button"
                className='ml-auto text-[#48a32a] text-2xl single-tall:text-[32px] single-taller:text-[36px] cursor-pointer'
                onClick={() => setShowPass(!showPass)}
              ><FaEye /></button>
            </div>
          </label>
 
          <div className='flex justify-between w-[85%] xs:w-[70%] text-[#192514] text-[15px] single-short:text-[14px] single-tall:text-[20px] single-taller:text-[22px]'>
            <label className='font-medium flex items-center'>
              <input type="checkbox"
                className='w-[30px]'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              {t('login.rememberMe')}
            </label>
            <Link to="/forgot-password" onClick={handleRememberMeChange} className='font-bold underline'>{t('login.forgotPassword')}</Link>
          </div>
 
          <div className='w-[80%] xs:w-[70%] flex flex-col items-center gap-4'>
            <button 
              type="submit"
              disabled={loading}
              className='bg-[#55BB33] w-full py-3 rounded-[6px] font-bold text-white hover:bg-[#66cd43] transition disabled:opacity-50'
            >
              {loading ? `${t('login.signingIn')}` : `${t('login.signInButton')}`}
            </button>
            <Link to="/signup" className='font-bold underline text-[#1A3D00]'>{t('login.createAccount')}</Link>
          </div>
        </form>

        {/* Return to Home */}
        <Link
          to="/"
          className={`absolute bottom-5 ${isArabic ? 'right-6' : 'left-6'} flex items-center gap-1.5 text-sm font-medium no-underline`}
          style={{ color: "rgba(25,37,20,0.55)", transition: "color 0.2s" }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#192514")}
          onMouseOut={(e) => (e.currentTarget.style.color = "rgba(25,37,20,0.55)")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>

          {t('login.ReturnToHome')}
        </Link>
      </div>
 
      {/* right side */}
      <div className='min-h-screen hidden laptop:flex laptop:w-1/2 bg-gradient-to-br from-[#C0E0B8] to-[#60BF40] flex-col justify-between'>
        <div className='px-[20px] pt-[15px]'>
          <h1 className='text-[white] text-3xl font-bold font-newblack'>SAHLA FARM</h1>
        </div>
        <div className='w-full flex justify-center'>
          <img
            src="/SAHLA_logo.png"
            alt={t('login.logoAlt')}
            className='w-[280px]'
          />
        </div>
        <div className='flex flex-col gap-[clamp(10px,1vh,15px)] mt-[clamp(20px,5vh,70px)] px-[clamp(20px,2.5vw,60px)]'>
          <h1 className='text-white font-bold text-[45px] leading-[3rem] font-newblack'>{t('login.rightSideTitle')}</h1>
          <p className='text-white font-semibold text-[16px] font-newblack'>{t('login.rightSideDesc')}</p>
        </div>
        <div className='flex w-full justify-between px-[clamp(15px,1.5vw,60px)] py-[clamp(10px,2vh,30px)] gap-2'>
          <LoginFeatureContainer
            title={t('login.feature1Title')}
            description={t('login.feature1Desc')}
            Icon={SmartAutomationIcon}
            size={10}
            colors={{bg:"rgba(215,255,202,0.6)",icon:"rgba(46,105,0,0.27)"}}

          />
          <LoginFeatureContainer
            title={t('login.feature2Title')}
            description={t('login.feature2Desc')}
            Icon={UnifiedPlatformIcon}
            size={10}
            colors={{bg:"rgba(215,255,202,0.6)",icon:"rgba(46,105,0,0.27)"}}
          />
        </div>
      </div>
    </div>
  )
}