import React, { useState } from 'react'
import { FaEye, FaLock, FaRegEnvelope } from 'react-icons/fa6'
import { Link } from 'react-router'
import { FiShoppingCart } from 'react-icons/fi'
import { FaExclamationCircle } from 'react-icons/fa'
import { BarChart3 } from 'lucide-react'
import LoginFeatureContainer from './../utilities/components/loginFeature'
import { useNavigate } from 'react-router'
 

 
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
 
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  }
 
  return (
    <div className='flex min-h-screen bg-[#F8FFF6] font-newblack'>
      {/* left side */}
      <div className='flex flex-col w-full laptop:w-1/2 justify-between h-screen min-h-screen pt-[clamp(18px,3.6vh,48px)] pb-[clamp(10px,1.8vh,24px)] single-short:pt-[12px] single-short:pb-[8px] single-tall:pt-[54px] single-tall:pb-[30px] single-taller:pt-[66px] single-taller:pb-[36px]'>
        <div className='flex flex-col items-center justify-center flex-[0.9] min-h-[clamp(110px,16vh,220px)] gap-[clamp(6px,1.1vh,14px)] single-short:min-h-[94px] single-short:gap-[6px] single-tall:min-h-[240px] single-tall:gap-[14px] single-taller:min-h-[280px] single-taller:gap-[18px]'>
          <h1 className='font-bold text-black text-[28px] xs:text-[30px] md:text-[34px] laptop:text-[36px] single-tall:text-[42px] single-taller:text-[48px] text-center'>WELCOLME BACK !</h1>
          <p className='text-[#636364] font-normal text-[16px] xs:text-[18px] md:text-[20px] laptop:text-[23px] single-tall:text-[25px] single-taller:text-[28px] text-center px-4'>Welcome back! Please enter your details.</p>
        </div>
 
        <form
          className='flex items-center justify-center flex-[1.35] gap-[clamp(16px,2.4vh,34px)] flex-col mt-[clamp(8px,1.8vh,24px)] min-h-[clamp(320px,44vh,560px)] single-short:min-h-[300px] single-short:gap-[12px] single-short:mt-[8px] single-tall:min-h-[610px] single-tall:gap-[34px] single-tall:mt-[18px] single-taller:min-h-[700px] single-taller:gap-[40px] single-taller:mt-[24px]'
          onSubmit={handleSubmit}
        >
          {/* email */}
          <label className='flex flex-col items-start w-[80%] xs:w-[70%] gap-[clamp(4px,0.8vh,10px)]'>
            <h2 className='text-[#444] font-medium font-family-poppins w-full text-[16px] single-tall:text-[21px] single-taller:text-[23px]'>Email Address</h2>
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
            <h2 className='text-[#444] font-medium font-family-poppins w-full text-[16px] single-tall:text-[21px] single-taller:text-[23px]'>Password</h2>
            <div className='flex border-2 rounded-[10px] border-[#D9D9D9] px-5 items-center py-[clamp(3px,0.8vh,10px)] w-full min-h-[clamp(48px,6vh,76px)] single-short:min-h-[44px] single-short:py-[2px] single-tall:min-h-[84px] single-tall:py-[13px] single-taller:min-h-[96px] single-taller:py-[16px]'>
              <span className='font-light text-[25px] single-tall:text-[36px] single-taller:text-[40px] text-[#929292]'><FaLock /></span>
              <input
                type={showPass ? "text" : "password"}
                className='outline-none text-[clamp(1.5ch,2vw,2.2ch)] single-tall:text-[2.55ch] single-taller:text-[2.8ch] text-[#444444] px-[12px] py-[3px] bg-transparent max-w-[80%]'
                placeholder='your password'
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
              <input type="checkbox" className='w-[30px]' />
              Remeber me
            </label>
            <Link to="/" className='font-bold underline'>forgot password</Link>
          </div>
 
          <div className='w-[85%] xs:w-[70%] flex justify-center mb-[clamp(6px,1.2vh,20px)] mt-[clamp(8px,1.8vh,24px)] flex-col items-center gap-[clamp(6px,1vh,14px)] single-short:mt-[8px] single-short:mb-[6px] single-short:gap-[6px] single-tall:mt-[26px] single-tall:mb-[26px] single-tall:gap-[14px] single-taller:mt-[32px] single-taller:mb-[30px] single-taller:gap-[18px]'>
            <button className='bg-[#55BB33] w-[90%] xs:w-[80%] py-[8px] single-tall:py-[16px] single-taller:py-[19px] rounded-[6px] font-bold text-white font-family-poppins cursor-pointer transition-all duration-300 hover:bg-[#66cd43] md:text-[22px] text-[20px] single-tall:text-[29px] single-taller:text-[33px] shadow-sm shadow-[#55BB33]'>
              Sign in
            </button>
            <Link to="/" className='font-bold underline text-[#1A3D00] text-center text-[14px] single-tall:text-[20px] single-taller:text-[22px]'>New to SAHLA FARM? Create an account</Link>
          </div>
        </form>
 
        {/* demo mode notice */}
        <div className='flex justify-center mt-[clamp(6px,1.1vh,18px)] max-w-[84%] self-center flex-[0.85] items-center min-h-[clamp(96px,14vh,220px)] single-short:min-h-[84px] single-tall:min-h-[210px] single-taller:min-h-[250px]'>
          <div className="bg-[#dcecd0] rounded-xl border-[#D9D9D9] px-[20px] py-[15px] single-short:px-[14px] single-short:py-[10px] single-tall:px-[30px] single-tall:py-[24px] single-taller:px-[36px] single-taller:py-[30px] text-[#3e9322]">
            <div className="flex items-center gap-2">
              <FaExclamationCircle className="w-10 text-2xl single-tall:text-[30px] single-taller:text-[34px]" />
              <span className="font-medium single-tall:text-[28px] single-taller:text-[31px]">Demo Mode</span>
            </div>
            <p className="mt-1 text-sm single-short:text-[12px] single-tall:text-[20px] single-taller:text-[22px] text-[#3b8622] text-center">
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
            src="/SAHLA_logo.png"
            alt="bags picture"
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
            colors={{bg:"rgba(215,255,202,0.6)",icon:"rgba(46,105,0,0.27)"}}

          />
          <LoginFeatureContainer
            title='Unified Platform'
            description='everything in one single place'
            Icon={BarChart3}
            size={10}
            colors={{bg:"rgba(215,255,202,0.6)",icon:"rgba(46,105,0,0.27)"}}
          />
        </div>
      </div>
    </div>
  )
}
