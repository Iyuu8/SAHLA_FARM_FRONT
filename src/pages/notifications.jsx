import React from 'react'
import { useState,useContext , useMemo} from 'react';
import { NotificationsContext } from '../layout';


export default function Notifications() {
  const {notifications=[],setNotifications} = useContext(NotificationsContext);
  const { unreadCount, totalCount } = useMemo(() => {
  return {
    unreadCount: notifications?.filter(n => !n.isRead).length || 0,
    totalCount: notifications?.length || 0,
  };
  }, [notifications]);
  const [filter, setFilter] = useState("all");
  const filtered = filter === "unread"
    ? notifications.filter(n => !n.isRead)
    : notifications;
  const groups = {
    today:     filtered.filter(n => n.date === "today"),
    yesterday: filtered.filter(n => n.date === "yesterday"),
    earlier:   filtered.filter(n => n.date === "earlier"),
  };
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
  };
  return (
    <div className='flex flex-col h-full md:p-1 pl-1 font-newblack w-full ml-2'>
      <div className='text-[#192514] md:text-[32px] text-[24px] font-bold font-newblack'>Notifications</div>
      <div className='flex justify-between items-center pr-3 pb-3'>
        <div className='flex md:gap-3 gap-2 '>
         <button
            onClick={() => setFilter("all")}
            className={`font-bold text-[11px] md:text-[17px] px-2 h-7 rounded-3xl transition-all duration-200
              ${filter === "all" ? "text-[#55BB33] bg-[#D6F7CB]" : "bg-[#DDEADB] text-[#192514]"}`}
          >
            ALL ({totalCount})
          </button>  
          <button
            onClick={() => setFilter("unread")}
            className={`font-bold text-[11px] md:text-[17px] px-2 h-7 rounded-3xl transition-all duration-200
              ${filter === "unread" ? "bg-[#D6F7CB] text-[#55BB33]" : "bg-[#DDEADB] text-[#192514]"}`}
          >
            UNREAD ({unreadCount})
          </button>
        </div>
        <button className='text-[#55BB33] text-[14px] md:text-[20px] font-bold' onClick={markAllAsRead} >Mark all read</button>
      </div >
      <div className='flex-1 overflow-y-auto scroll-smooth max-h-full custom-scroll'>
        {groups.today.length > 0 && <div className='flex flex-col'>
          <h1 className='text-[16px] md:text-[24px] font-bold'>TODAY</h1>
          <div className='flex flex-col w-full gap-1'>
            {(groups?.today || []).map((item)=>{
              return(
              <div key={item.id} className='md:px-5 px-2 md:py-[10px] py-[5px] flex w-full justify-between items-center gap-1
               hover:bg-[#DDEADB75] cursor-pointer 
               transition-colors duration-200 rounded-[20px]'
               onClick={() =>markAsRead(item.id)}
               >
                <div className='flex flex-col flex-shrink'>
                  <h1 className={`${item.isRead ? "text-[rgba(0,0,0,0.65)]":"text-[#192514]"} font-bold text-[16px] md:text-[24px]`}>{item.title}</h1>
                  <p className={`${item.isRead ? "text-[#9F9D9D]" : ""} font-normal text-[12px] md:text-[20px]`}>{item.description} </p>
                  <h2 className={`${item.isRead ? "text-[#919190]":"text-[#55BB33]"} font-bold text-[12px] md:text-[20px]`}>{item.time} </h2>
                </div>
                {!item.isRead && <div className='md:w-[19px] md:h-[19px] w-[11px] h-[11px] bg-[#55BB33] rounded-[50%] flex-shrink-0' style={{boxShadow:"0 0 10px 0.5px rgba(85, 187, 51, 1)"}}></div>}
              </div>)
            })}
          </div>
          </div>}
          {groups.yesterday.length > 0 && <div className='flex flex-col'>
          <h1 className='text-[16px] md:text-[24px] font-bold'>YESTERDAY</h1>
          <div className='flex flex-col w-full gap-1'>
            {groups.yesterday.map((item)=>{
              return(
              <div key={item.id} className='md:px-5 px-2 md:py-[10px] py-[5px] flex w-full justify-between items-center gap-1
               hover:bg-[#DDEADB75] cursor-pointer 
               transition-colors duration-200 rounded-[20px]'
               onClick={() =>markAsRead(item.id)}
               >
                <div className='flex flex-col flex-shrink'>
                  <h1 className={`${item.isRead ? "text-[rgba(0,0,0,0.65)]":"text-[#192514]"} font-bold text-[16px] md:text-[24px]`}>{item.title}</h1>
                  <p className={`${item.isRead ? "text-[#9F9D9D]" : ""} font-normal text-[12px] md:text-[20px]`}>{item.description} </p>
                  <h2 className={`${item.isRead ? "text-[#919190]":"text-[#55BB33]"} text-[12px] md:text-[20px]`}>{item.time} </h2>
                </div>
                {!item.isRead && <div className='w-[11px] h-[11px] md:w-[19px] md:h-[19px] bg-[#55BB33] rounded-[50%] flex-shrink-0' style={{boxShadow:"0 0 10px 0.5px rgba(85, 187, 51, 1)"}}></div>}
              </div>)
            })}
          </div>
          </div>}
          {groups.earlier.length > 0 && <div className='flex flex-col'>
          <h1 className='md:text-[24px] text-[16px] font-bold'>EARLIER</h1>
          <div className='flex flex-col w-full gap-1'>
            {groups.earlier.map((item)=>{
              return(
              <div key={item.id} className='md:px-5 px-2 md:py-[10px] py-[5px] flex w-full justify-between items-center gap-1
               hover:bg-[#DDEADB75] cursor-pointer 
               transition-colors duration-200 rounded-[20px]'
               onClick={() =>markAsRead(item.id)}
               >
                <div className='flex flex-col flex-shrink'>
                  <h1 className={`${item.isRead ? "text-[rgba(0,0,0,0.65)]":"text-[#192514]"} font-bold text-[16px] md:text-[24px]`}>{item.title}</h1>
                  <p className={`${item.isRead ? "text-[#9F9D9D]" : ""} font-normal text-[12px] md:text-[20px]`}>{item.description} </p>
                  <h2 className={`${item.isRead ? "text-[#919190]":"text-[#55BB33]"} font-bold text-[12px] md:text-[20px]`}>{item.time} </h2>
                </div>
                {!item.isRead && <div className='w-[11px] h-[11px] md:w-[19px] md:h-[19px] bg-[#55BB33] rounded-[50%] flex-shrink-0' style={{boxShadow:"0 0 10px 0.5px rgba(85, 187, 51, 1)"}}></div>}
              </div>)
            })}
          </div>
          </div>}
      </div>
        
          

    </div>
  )
}
