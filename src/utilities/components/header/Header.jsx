import React from 'react'
import { Link } from 'react-router'
import { NotificationsContext } from '../../../layout';
import { useState,useEffect,useContext } from 'react';
import { useTranslation } from 'react-i18next';


const LogoIcon = () => (
  <svg className='w-7 h-7 md:w-9 md:h-9 lg:w-11 lg:h-11' width="45" height="45" viewBox="0 0 44 45" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.4877 23.6092C22.4877 23.6092 24.8105 19.3465 29.7453 18.3817C29.7453 18.3817 22.5846 15.3262 15.0848 18.3817C15.0848 18.3817 19.1489 18.8649 22.4877 23.6092Z" fill="#55BB33"/>
    <path d="M22.567 26.8841C22.567 26.8841 22.6389 27.4471 22.9781 27.5545C23.3173 27.6618 33.2353 28.7243 38.2068 18.1001C38.2068 18.1001 37.7105 17.6901 35.9692 19.0307C35.9692 19.0307 31.5512 23.9084 27.882 23.7083C27.882 23.7083 27.6824 23.0884 31.9462 21.0465C31.9462 21.0465 32.9548 20.2151 32.1033 19.9304C32.1033 19.9304 27.3476 21.1132 25.204 22.7305C25.204 22.7305 23.8972 23.2397 22.567 26.8858V26.8841Z" fill="#55BB33"/>
    <path d="M22.2733 26.8859C22.2733 26.8859 22.2014 27.4488 21.8622 27.5562C21.5231 27.6636 11.605 28.726 6.63354 18.1018C6.63354 18.1018 7.12981 17.6918 8.87116 19.0324C8.87116 19.0324 13.2891 23.9101 16.9583 23.71C16.9583 23.71 17.158 23.0901 12.8942 21.0482C12.8942 21.0482 11.8855 20.2169 12.7371 19.9321C12.7371 19.9321 17.4927 21.1149 19.6364 22.7322C19.6364 22.7322 20.9431 23.2414 22.2733 26.8875V26.8859Z" fill="#55BB33"/>
    <path d="M22.8401 17.0231C22.8401 17.0231 23.3554 11.698 20.8403 9.87417C18.3238 8.05195 13.179 9.33726 12.163 7.47925C12.163 7.47925 12.4214 18.9169 21.5333 16.2178C21.5333 16.2178 20.3235 11.7143 15.6794 10.6779C15.6794 10.6779 20.9416 11.0261 22.1867 17.0443L22.8401 17.0215V17.0231Z" fill="#55BB33"/>
    <path d="M18.9345 0C18.9345 0 19.1195 1.38619 22.3056 3.50452C25.4917 5.62285 23.5727 8.95654 22.8386 10.1719C22.8386 10.1719 23.4597 6.43634 20.507 3.94218C20.507 3.94218 22.8944 6.14999 22.3379 10.1817C22.3379 10.1817 16.5663 8.29598 18.9345 0Z" fill="#55BB33"/>
    <path d="M23.1337 16.0047C23.1337 16.0047 23.7798 10.1052 29.5059 8.90779C29.5059 8.90779 25.7311 9.69362 24.2305 13.914C24.2305 13.914 29.8613 16.5237 32.2002 9.51628C32.2002 9.51628 32.877 6.56656 32.7816 6.11914C32.7816 6.11914 31.7494 7.28081 27.0378 7.3166C27.0378 7.3166 22.1016 7.2987 23.1337 16.0047Z" fill="#55BB33"/>
    <path d="M40.8056 33.0926C40.8056 33.0926 36.8384 31.5079 33.5069 34.8709L31.4558 33.2032C31.4558 33.2032 34.6771 28.5452 42.1373 30.1298L40.807 33.0926H40.8056Z" fill="#55BB33"/>
    <path d="M43.4073 25.524L42.6614 28.4639C42.6614 28.4639 34.1896 25.9291 29.8789 31.9554L27.2595 30.7433C27.2595 30.7433 32.6641 22.9159 43.4088 25.5256L43.4073 25.524Z" fill="#55BB33"/>
    <path d="M36.1453 38.8261L39.4284 34.8579C39.4284 34.8579 36.0793 34.2706 34.8856 36.3271L36.1453 38.8261Z" fill="#55BB33"/>
    <path d="M2.60467 33.0569C2.60467 33.0569 6.57188 31.4722 9.90334 34.8352L11.9545 33.1676C11.9545 33.1676 8.73315 28.5095 1.27297 30.0942L2.60321 33.0569H2.60467Z" fill="#55BB33"/>
    <path d="M0.00146828 25.4866L0.747339 28.4266C0.747339 28.4266 9.21914 25.8917 13.5299 31.9181L16.1493 30.706C16.1493 30.706 10.7446 22.8786 0 25.4882L0.00146828 25.4866Z" fill="#55BB33"/>
    <path d="M7.26343 38.7888L3.98042 34.8205C3.98042 34.8205 7.3295 34.2332 8.52319 36.2897L7.26343 38.7888Z" fill="#55BB33"/>
    <path d="M16.7469 44.3009C16.7469 44.3009 21.7213 44.6686 26.3639 44.2276C26.3639 44.2276 21.5891 38.7154 16.7469 44.3009Z" fill="#55BB33"/>
    <path d="M15.0525 42.9814L12.5212 41.81C12.5212 41.81 20.9813 30.0567 30.6893 41.9873L28.3181 43.053C28.3181 43.053 21.6537 34.6024 15.0525 42.9814Z" fill="#55BB33"/>
    <path d="M10.8562 40.9575C10.8562 40.9575 20.3088 26.8613 32.1649 40.8517L34.3115 39.4314C34.3115 39.4314 23.3525 21.5704 8.93283 39.4314L10.8548 40.9575H10.8562Z" fill="#55BB33"/>
  </svg>
);
const ClockIcon = () => (
  <svg className='w-[18px] h-[18px] lg:w-[18px] lg:h-[18px]' /* width="18" height="18" */ viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_101_2112)">
      <path d="M6.99996 3.50008V7.00008L9.33329 8.16675M12.8333 7.00008C12.8333 10.2217 10.2216 12.8334 6.99996 12.8334C3.7783 12.8334 1.16663 10.2217 1.16663 7.00008C1.16663 3.77842 3.7783 1.16675 6.99996 1.16675C10.2216 1.16675 12.8333 3.77842 12.8333 7.00008Z"
        stroke="#192514" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_101_2112">
        <rect width="14" height="14" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.2975 15.75C10.1656 15.9773 9.97638 16.166 9.74867 16.2971C9.52096 16.4283 9.26278 16.4973 9 16.4973C8.73722 16.4973 8.47904 16.4283 8.25133 16.2971C8.02362 16.166 7.83436 15.9773 7.7025 15.75M13.5 6C13.5 4.80653 13.0259 3.66193 12.182 2.81802C11.3381 1.97411 10.1935 1.5 9 1.5C7.80653 1.5 6.66193 1.97411 5.81802 2.81802C4.97411 3.66193 4.5 4.80653 4.5 6C4.5 11.25 2.25 12.75 2.25 12.75H15.75C15.75 12.75 13.5 11.25 13.5 6Z"
      stroke="#192514" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
export default function Header() {
  const { t } = useTranslation();
  const [time, setTime] = useState("");
  const { notificationCount = 0 } = useContext(NotificationsContext) || {};
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? t('header.pm') : t('header.am');
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();                                    // run immediately on mount
    const interval = setInterval(updateTime, 60000); // update every minute
    return () => clearInterval(interval);            // cleanup on unmount
  }, [t]);
  
const getBadgeText = () => {
    if (notificationCount > 99) return "+99";
    return notificationCount.toString();
  };
  return (
    <div className='flex w-full justify-between items-center'>
      <div className='flex items-center  w-full gap-2'>
         
        <div className='md:hidden'><LogoIcon/></div>
        <span className='text-[#192514] text-[15px] lg:text-[32px] md:text-[26px] font-normal font-newblack'>SAHLA Farm</span>
      </div>
      
      <div className='flex justify-end  gap-1 w-full'>
        <div className='flex items-center gap-1 bg-white px-2 py-1 rounded-3xl border border-[rgba(25,37,20,0.36)]'>
            <ClockIcon/>
            <span className='text-[#192514] opacity-80 text-[11px] md:text-[15px]'>{time}</span>
        </div>
        <Link
  to="/notifications"
  className='relative flex items-center gap-1 md:bg-white px-2 py-1 rounded-3xl
    md:border md:border-[rgba(25,37,20,0.36)]
    '
>
  {/* Bell + badge wrapper — relative for badge positioning */}
  <div className="relative">
    <BellIcon />
    {/* Badge — on top of bell on mobile, next to text on desktop */}
    
  </div>
  <span className='hidden font-newblack md:block text-[#192514] opacity-80 text-[15px] '>
    {t("header.notifications")}
  </span>
  <div className={`${notificationCount > 0 ? "" : "hidden"}
      absolute -top-[3px] -right-[0.5px]
      md:static md:top-auto md:right-auto
      bg-[#E22A49] w-[18px] h-[18px] md:w-[23px] md:h-[23px]
      flex justify-center items-center rounded-full
      text-white text-[10px] md:text-xs font-bold`}
      >
      {getBadgeText()}
    </div>

  {/* Text — hidden on mobile */}
  

      </Link>
      </div>
    </div>
  )
}
