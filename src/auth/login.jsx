import React, { useState, useEffect, useRef } from 'react'
import { FaEye, FaLock, FaRegEnvelope } from 'react-icons/fa6'
import { Link } from 'react-router'
import { FaExclamationCircle } from 'react-icons/fa'
import { Bot, Phone } from 'lucide-react'
import LoginFeatureContainer from '../utilities/components/login/loginFeature'
import { useNavigate } from 'react-router'
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client'
import LanguageSwitcher from '../utilities/components/login/LanguageSwitcher' 

export default function Login() {
  const { t } = useTranslation();
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
          const res = await fetch('http://localhost:5000/api/auth/signupSetup', {
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
          throw new Error(t('login.errors.invalid'));
        } else if (signinError.message.includes('Email not confirmed')) {
          throw new Error(t('login.errors.unconfirmed'));
        } else {
          throw signinError;
        };
      };
      if (data.session) {
        // Call loginSetup
        try {
          await fetch('http://localhost:5000/api/auth/loginSetup', {
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
        /* const socket = io('http://localhost:3000', {
          auth: {
            token: session.access_token
          },
          transports: ['websocket']
        });

        socket.on('connect', () => {
          console.log('Connected to WebSocket server');
        });

        socket.emit("sendMessage", "Hello from Frontend");
        socket.on("recieveMessage", (data) => {
          console.log("message from Backend", data);
        })
        
        localStorage.setItem('socket_connected', 'true'); */
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
      <div className='flex flex-col w-full laptop:w-1/2 justify-between h-screen min-h-screen pt-[clamp(18px,3.6vh,48px)] pb-[clamp(10px,1.8vh,24px)] single-short:pt-[12px] single-short:pb-[8px] single-tall:pt-[54px] single-tall:pb-[30px] single-taller:pt-[66px] single-taller:pb-[36px]'>
        <div className='flex flex-col items-center justify-center flex-[0.9] min-h-[clamp(110px,16vh,220px)] gap-[clamp(6px,1.1vh,14px)] single-short:min-h-[94px] single-short:gap-[6px] single-tall:min-h-[240px] single-tall:gap-[14px] single-taller:min-h-[280px] single-taller:gap-[18px]'>
          <h1 className='font-bold text-black text-[28px] xs:text-[30px] md:text-[34px] laptop:text-[36px] single-tall:text-[42px] single-taller:text-[48px] text-center'>{t('login.welcomeBackTitle')}</h1>
          <p className='text-[#636364] font-normal text-[16px] xs:text-[18px] md:text-[20px] laptop:text-[23px] single-tall:text-[25px] single-taller:text-[28px] text-center px-4'>{t('login.welcomeBackSubtitle')}</p>
        </div>
 {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto w-[80%] mb-4'>
            {error}
          </div>
        )}
        <form
          className='flex items-center justify-center flex-[1.35] gap-[clamp(16px,2.4vh,34px)] flex-col mt-[clamp(8px,1.8vh,24px)] min-h-[clamp(320px,44vh,560px)] single-short:min-h-[300px] single-short:gap-[12px] single-short:mt-[8px] single-tall:min-h-[610px] single-tall:gap-[34px] single-tall:mt-[18px] single-taller:min-h-[700px] single-taller:gap-[40px] single-taller:mt-[24px]'
          onSubmit={handleSubmit}
        >
          {/* email */}
          <label className='flex flex-col items-start w-[80%] xs:w-[70%] gap-[clamp(4px,0.8vh,10px)]'>
            <h2 className='text-[#444] font-medium font-family-poppins w-full text-[16px] single-tall:text-[21px] single-taller:text-[23px]'>{t('login.emailLabel')}</h2>
            <div className='flex border-2 rounded-[10px] border-[#D9D9D9] px-5 items-center py-[clamp(3px,0.8vh,10px)] w-full min-h-[clamp(48px,6vh,76px)] single-short:min-h-[44px] single-short:py-[2px] single-tall:min-h-[84px] single-tall:py-[13px] single-taller:min-h-[96px] single-taller:py-[16px]'>
              <span className='font-light text-[30px] single-tall:text-[38px] single-taller:text-[42px] text-[#929292]'><FaRegEnvelope /></span>
              <input
                type="text"
                className='outline-none text-[clamp(1.5ch,2vw,2.2ch)] single-tall:text-[2.55ch] single-taller:text-[2.8ch] text-[#444444] px-[12px] py-[3px] bg-transparent max-w-[80%]'
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
                className='outline-none text-[clamp(1.5ch,2vw,2.2ch)] single-tall:text-[2.55ch] single-taller:text-[2.8ch] text-[#444444] px-[12px] py-[3px] bg-transparent max-w-[80%]'
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
              {loading ? t('login.signingIn') : `${t('login.signInButton')}`}
            </button>
            <Link to="/signup" className='font-bold underline text-[#1A3D00]'>{t('login.createAccount')}</Link>
          </div>
        </form>
 
        {/* demo mode notice */}
        <div className='flex justify-center mt-[clamp(6px,1.1vh,18px)] max-w-[84%] self-center flex-[0.85] items-center min-h-[clamp(96px,14vh,220px)] single-short:min-h-[84px] single-tall:min-h-[210px] single-taller:min-h-[250px]'>
          <div className="bg-[#dcecd0] rounded-xl border-[#D9D9D9] px-[20px] py-[15px] single-short:px-[14px] single-short:py-[10px] single-tall:px-[30px] single-tall:py-[24px] single-taller:px-[36px] single-taller:py-[30px] text-[#3e9322]">
            <div className="flex items-center gap-2">
              <FaExclamationCircle className="w-10 text-2xl single-tall:text-[30px] single-taller:text-[34px]" />
              <span className="font-medium single-tall:text-[28px] single-taller:text-[31px]">{t('login.demoMode')}</span>
            </div>
            <p className="mt-1 text-sm single-short:text-[12px] single-tall:text-[20px] single-taller:text-[22px] text-[#3b8622] text-center">
              {t('login.demoModeDesc')}
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
