import React, { useState } from 'react'
import {
  FaCalendar,
  FaEye,
  FaLock,
  FaLocationDot,
  FaRegEnvelope,
  FaUser,
} from 'react-icons/fa6'
import { Link } from 'react-router'
import { FiShoppingCart } from 'react-icons/fi'
import { FaExclamationCircle } from 'react-icons/fa'
import { BarChart3 } from 'lucide-react'
import LoginFeatureContainer from '../utilities/components/login/loginFeature'
import { useNavigate } from 'react-router'

export default function SignUp() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [age, setAge] = useState('')
  const [address, setAddress] = useState('')
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/login')
  }

  return (
    <div className='flex min-h-screen bg-[#F8FFF6] font-newblack'>
      {/* left side */}
      <div className='flex flex-col w-full laptop:w-1/2 justify-between h-screen min-h-screen pt-[clamp(14px,2.6vh,34px)] pb-[clamp(8px,1.2vh,18px)] single-short:pt-[10px] single-short:pb-[6px] single-tall:pt-[44px] single-tall:pb-[22px] single-taller:pt-[54px] single-taller:pb-[28px]'>
        <div className='flex flex-col items-center justify-center flex-[0.75] min-h-[clamp(90px,12vh,170px)] gap-[clamp(4px,0.8vh,10px)] single-short:min-h-[82px] single-short:gap-[4px] single-tall:min-h-[190px] single-tall:gap-[10px] single-taller:min-h-[220px] single-taller:gap-[12px]'>
          <h1 className='font-bold text-black text-[28px] xs:text-[30px] md:text-[34px] laptop:text-[36px] single-tall:text-[40px] single-taller:text-[45px] text-center'>CREATE ACCOUNT</h1>
          <p className='text-[#636364] font-normal text-[15px] xs:text-[16px] md:text-[18px] laptop:text-[20px] single-tall:text-[23px] single-taller:text-[26px] text-center px-4'>Fill in the details below to get started.</p>
        </div>

        <form
          className='flex items-center justify-center flex-[1.5] gap-[clamp(8px,1.2vh,14px)] flex-col mt-[clamp(4px,1vh,12px)] min-h-[clamp(360px,52vh,500px)] single-short:min-h-[350px] single-short:gap-[7px] single-short:mt-[4px] single-tall:min-h-[700px] single-tall:gap-[12px] single-tall:mt-[12px] single-taller:min-h-[790px] single-taller:gap-[14px] single-taller:mt-[16px]'
          onSubmit={handleSubmit}
        >
          <label className='flex flex-col items-start w-[80%] xs:w-[70%] gap-[4px]'>
            <h2 className='text-[#444] font-medium font-family-poppins w-full text-[14px] md:text-[15px] single-tall:text-[20px] single-taller:text-[22px]'>Username</h2>
            <div className='flex border-2 rounded-[10px] border-[#D9D9D9] px-4 items-center py-[1px] w-full min-h-[40px] single-tall:min-h-[66px] single-tall:py-[8px] single-taller:min-h-[74px] single-taller:py-[10px]'>
              <span className='font-light text-[22px] single-tall:text-[33px] single-taller:text-[36px] text-[#929292]'><FaUser /></span>
              <input
                type='text'
                className='outline-none text-[clamp(1.3ch,1.7vw,2ch)] single-tall:text-[2.4ch] single-taller:text-[2.65ch] text-[#444444] px-[10px] py-[2px] bg-transparent max-w-[90%]'
                placeholder='your username'
                required
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>
          </label>

          <label className='flex flex-col items-start w-[80%] xs:w-[70%] gap-[4px]'>
            <h2 className='text-[#444] font-medium font-family-poppins w-full text-[14px] md:text-[15px] single-tall:text-[20px] single-taller:text-[22px]'>Email Address</h2>
            <div className='flex border-2 rounded-[10px] border-[#D9D9D9] px-4 items-center py-[1px] w-full min-h-[40px] single-tall:min-h-[66px] single-tall:py-[8px] single-taller:min-h-[74px] single-taller:py-[10px]'>
              <span className='font-light text-[22px] single-tall:text-[33px] single-taller:text-[36px] text-[#929292]'><FaRegEnvelope /></span>
              <input
                type='text'
                className='outline-none text-[clamp(1.3ch,1.7vw,2ch)] single-tall:text-[2.4ch] single-taller:text-[2.65ch] text-[#444444] px-[10px] py-[2px] bg-transparent max-w-[80%]'
                placeholder='you@example.com'
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
          </label>

          <label className='flex flex-col items-start w-[80%] xs:w-[70%] gap-[4px]'>
            <h2 className='text-[#444] font-medium font-family-poppins w-full text-[14px] md:text-[15px] single-tall:text-[20px] single-taller:text-[22px]'>Password</h2>
            <div className='flex border-2 rounded-[10px] border-[#D9D9D9] px-4 items-center py-[1px] w-full min-h-[40px] single-tall:min-h-[66px] single-tall:py-[8px] single-taller:min-h-[74px] single-taller:py-[10px]'>
              <span className='font-light text-[22px] single-tall:text-[32px] single-taller:text-[35px] text-[#929292]'><FaLock /></span>
              <input
                type={showPass ? 'text' : 'password'}
                className='outline-none text-[clamp(1.3ch,1.7vw,2ch)] single-tall:text-[2.4ch] single-taller:text-[2.65ch] text-[#444444] px-[10px] py-[2px] bg-transparent max-w-[80%]'
                placeholder='your password'
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button
                type='button'
                className='ml-auto text-[#48a32a] text-[22px] single-tall:text-[32px] single-taller:text-[35px] cursor-pointer'
                onClick={() => setShowPass(!showPass)}
              ><FaEye /></button>
            </div>
          </label>

          <div className='w-[80%] xs:w-[70%] grid grid-cols-[35fr_65fr] gap-2 single-tall:gap-3 single-taller:gap-4'>
            <label className='flex flex-col items-start gap-[4px] min-w-0'>
              <h2 className='text-[#444] font-medium font-family-poppins w-full text-[14px] md:text-[15px] single-tall:text-[20px] single-taller:text-[22px]'>Age</h2>
              <div className='flex border-2 rounded-[10px] border-[#D9D9D9] px-3 items-center py-[1px] w-full min-h-[40px] single-tall:min-h-[66px] single-tall:py-[8px] single-taller:min-h-[74px] single-taller:py-[10px]'>
                <span className='font-light text-[20px] single-tall:text-[30px] single-taller:text-[33px] text-[#929292]'><FaCalendar /></span>
                <input
                  type='number'
                  className='outline-none text-[clamp(1.1ch,1.3vw,1.6ch)] single-tall:text-[1.95ch] single-taller:text-[2.2ch] text-[#444444] px-[8px] py-[2px] bg-transparent w-full min-w-0'
                  placeholder='your age'
                  required
                  onChange={(e) => setAge(e.target.value)}
                  value={age}
                />
              </div>
            </label>

            <label className='flex flex-col items-start gap-[4px] min-w-0'>
              <h2 className='text-[#444] font-medium font-family-poppins w-full text-[14px] md:text-[15px] single-tall:text-[20px] single-taller:text-[22px]'>Address</h2>
              <div className='flex border-2 rounded-[10px] border-[#D9D9D9] px-4 items-center py-[1px] w-full min-h-[40px] single-tall:min-h-[66px] single-tall:py-[8px] single-taller:min-h-[74px] single-taller:py-[10px]'>
                <span className='font-light text-[22px] single-tall:text-[33px] single-taller:text-[36px] text-[#929292]'><FaLocationDot /></span>
                <input
                  type='text'
                  className='outline-none text-[clamp(1.3ch,1.7vw,2ch)] single-tall:text-[2.4ch] single-taller:text-[2.65ch] text-[#444444] px-[10px] py-[2px] bg-transparent w-full min-w-0'
                  placeholder='your address'
                  required
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                />
              </div>
            </label>
          </div>

          <div className='w-[85%] xs:w-[70%] flex justify-center mb-[clamp(4px,1vh,10px)] mt-[clamp(4px,1vh,12px)] flex-col items-center gap-[clamp(5px,0.8vh,10px)] single-tall:mt-[16px] single-tall:mb-[16px] single-tall:gap-[12px] single-taller:mt-[20px] single-taller:mb-[18px] single-taller:gap-[14px]'>
            <button className='bg-[#55BB33] w-[90%] xs:w-[80%] py-[6px] single-tall:py-[13px] single-taller:py-[16px] rounded-[6px] font-bold text-white font-family-poppins cursor-pointer transition-all duration-300 hover:bg-[#66cd43] md:text-[20px] text-[18px] single-tall:text-[28px] single-taller:text-[31px] shadow-sm shadow-[#55BB33]'>
              Create Account
            </button>
            <Link to='/login' className='font-bold underline text-[#1A3D00] text-center text-[13px] md:text-[14px] single-tall:text-[19px] single-taller:text-[21px]'>Already have an account? Sign in</Link>
          </div>
        </form>

        {/* demo mode notice */}
        <div className='flex justify-center mt-[clamp(6px,1.1vh,18px)] max-w-[84%] self-center flex-[0.85] items-center min-h-[clamp(96px,14vh,220px)] single-short:min-h-[84px] single-tall:min-h-[210px] single-taller:min-h-[250px]'>
          <div className='bg-[#dcecd0] rounded-xl border-[#D9D9D9] px-[20px] py-[15px] single-short:px-[14px] single-short:py-[10px] single-tall:px-[30px] single-tall:py-[24px] single-taller:px-[36px] single-taller:py-[30px] text-[#3e9322]'>
            <div className='flex items-center gap-2'>
              <FaExclamationCircle className='w-10 text-2xl single-tall:text-[30px] single-taller:text-[34px]' />
              <span className='font-medium single-tall:text-[28px] single-taller:text-[31px]'>Demo Mode</span>
            </div>
            <p className='mt-1 text-sm single-short:text-[12px] single-tall:text-[20px] single-taller:text-[22px] text-[#3b8622] text-center'>
              Use any email/password to test the login flow
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
            src='/SAHLA_logo.png'
            alt='bags picture'
            className='w-[280px]'
          />
        </div>
        <div className='flex flex-col gap-[clamp(10px,1vh,15px)] mt-[clamp(20px,5vh,70px)] px-[clamp(20px,2.5vw,60px)]'>
          <h1 className='text-white font-bold text-[45px] leading-[3rem] font-newblack'>Manage your Farm with confidence</h1>
          <p className='text-white font-semibold text-[16px] font-newblack'>Monitor your farm, automate decisions, and manage everything from one unified intelligent platform.</p>
        </div>
        <div className='flex w-full justify-between px-[clamp(15px,1.5vw,60px)] py-[clamp(10px,2vh,30px)] gap-2'>
          <LoginFeatureContainer
            title='Smart Automation'
            description='monitor & automate instantly'
            Icon={FiShoppingCart}
            size={10}
            colors={{ bg: 'rgba(215,255,202,0.6)', icon: 'rgba(46,105,0,0.27)' }}
          />
          <LoginFeatureContainer
            title='Unified Platform'
            description='everything in one single place'
            Icon={BarChart3}
            size={10}
            colors={{ bg: 'rgba(215,255,202,0.6)', icon: 'rgba(46,105,0,0.27)' }}
          />
        </div>
      </div>
    </div>
  )
}
