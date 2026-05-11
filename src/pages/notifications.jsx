import React from 'react'
import { useState, useContext, useMemo } from 'react';
import { NotificationsContext } from '../layout';
import useNotifications from '../hooks/useNotifications';
import { useTranslation } from 'react-i18next';
import HACredentialsRequired from './haCredentialsRequired'
import DynamicTranslator from '../utilities/components/Translation/DynamicTranslator';

export default function Notifications() {
  const { t, i18n } = useTranslation();
  const {
    notifications = [],
    loading,
    loadingMore,
    hasMore,
    error,
    markAsRead,
    markAllAsRead,
    loadMore,
  } = useNotifications();

  const { unreadCount, totalCount } = useMemo(() => ({
    unreadCount: notifications?.filter(n => !n.isRead).length || 0,
    totalCount: notifications?.length || 0,
  }), [notifications]);

  const [filter, setFilter] = useState("all");

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const filtered = filter === "unread"
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const groups = {
    today:     filtered.filter(n => n.date === "today"),
    yesterday: filtered.filter(n => n.date === "yesterday"),
    earlier:   filtered.filter(n => n.date === "earlier"),
  };

  if (loading) return (
    <div className='flex flex-1 items-center justify-center font-newblack'>
      <p className='text-[#192514] font-semibold text-lg'>{t('notifications.loading')}</p>
    </div>
  );

  if (error) {
    if (error.includes('credentials') || error.includes('farm')) {
      return <HACredentialsRequired />;
    }
    return (
      <div className='flex flex-1 items-center justify-center font-newblack'>
        <p className='text-red-500 font-semibold text-lg'>{error}</p>
      </div>
    );
  }

  const NotificationItem = ({ item }) => (
    <div
      className='md:px-5 px-2 md:py-[10px] py-[5px] flex w-full justify-between items-center gap-1
        hover:bg-[#DDEADB75] cursor-pointer transition-colors duration-200 rounded-[20px]'
      onClick={() => handleMarkAsRead(item.id)}
    >
      <div className='flex flex-col flex-shrink'>
        <DynamicTranslator
          text={item.title}
          language={i18n.language}
          className={`${item.isRead ? "text-[rgba(0,0,0,0.65)]" : "text-[#192514]"} font-bold text-[16px] md:text-[24px]`}
        />
        <DynamicTranslator
          text={item.description}
          language={i18n.language}
          className={`${item.isRead ? "text-[#9F9D9D]" : ""} font-normal text-[12px] md:text-[20px]`}
        />
        <DynamicTranslator
          text={item.time}
          language={i18n.language}
          className={`${item.isRead ? "text-[#919190]" : "text-[#55BB33]"} font-bold text-[12px] md:text-[20px]`}
        />
      </div>
      {!item.isRead && (
        <div
          className='md:w-[19px] md:h-[19px] w-[11px] h-[11px] bg-[#55BB33] rounded-[50%] flex-shrink-0'
          style={{ boxShadow: "0 0 10px 0.5px rgba(85, 187, 51, 1)" }}
        />
      )}
    </div>
  );

  const isEmpty =
    groups.today.length === 0 &&
    groups.yesterday.length === 0 &&
    groups.earlier.length === 0;

  return (
    <div className='flex flex-col h-full md:p-1 pl-1 font-newblack w-full ml-2'>
      <div className='text-[#192514] md:text-[32px] text-[24px] font-bold font-newblack'>
        {t('notifications.title')}
      </div>
      <div className='flex justify-between items-center pr-3 pb-3'>
        <div className='flex md:gap-3 gap-2'>
          <button
            onClick={() => setFilter("all")}
            className={`font-bold text-[11px] md:text-[17px] px-2 h-7 rounded-3xl transition-all duration-200
              ${filter === "all" ? "text-[#55BB33] bg-[#D6F7CB]" : "bg-[#DDEADB] text-[#192514]"}`}
          >
            {t('notifications.all')} ({totalCount})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`font-bold text-[11px] md:text-[17px] px-2 h-7 rounded-3xl transition-all duration-200
              ${filter === "unread" ? "bg-[#D6F7CB] text-[#55BB33]" : "bg-[#DDEADB] text-[#192514]"}`}
          >
            {t('notifications.unread')} ({unreadCount})
          </button>
        </div>
        <button
          className='text-[#55BB33] text-[14px] md:text-[20px] font-bold'
          onClick={handleMarkAllAsRead}
        >
          {t('notifications.mark_all_read')}
        </button>
      </div>

      <div className='flex-1 overflow-y-auto scroll-smooth max-h-full custom-scroll'>
        {/* Empty state for unread filter */}
        {filter === "unread" && unreadCount === 0 && (
          <div className="text-center text-gray-400 py-10">
            {t('notifications.no_unread')}
          </div>
        )}

        {/* Empty state for all filter */}
        {filter === "all" && isEmpty && !hasMore && (
          <div className="text-center text-gray-400 py-10">
            {t('notifications.no_notifications') || 'No notifications'}
          </div>
        )}

        {groups.today.length > 0 && (
          <div className='flex flex-col'>
            <h1 className='text-[16px] md:text-[24px] font-bold'>{t('notifications.today')}</h1>
            <div className='flex flex-col w-full gap-1'>
              {groups.today.map(item => <NotificationItem key={item.id} item={item} />)}
            </div>
          </div>
        )}

        {groups.yesterday.length > 0 && (
          <div className='flex flex-col'>
            <h1 className='text-[16px] md:text-[24px] font-bold'>{t('notifications.yesterday')}</h1>
            <div className='flex flex-col w-full gap-1'>
              {groups.yesterday.map(item => <NotificationItem key={item.id} item={item} />)}
            </div>
          </div>
        )}

        {groups.earlier.length > 0 && (
          <div className='flex flex-col'>
            <h1 className='md:text-[24px] text-[16px] font-bold'>{t('notifications.earlier')}</h1>
            <div className='flex flex-col w-full gap-1'>
              {groups.earlier.map(item => <NotificationItem key={item.id} item={item} />)}
            </div>
          </div>
        )}

        {/* Load more — only shown on "all" filter since pagination is server-driven */}
        {filter === "all" && hasMore && (
          <div className="flex justify-center py-4">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="font-newblack font-bold text-[14px] md:text-[18px] px-6 py-2
                bg-[#DDEADB] text-[#192514] rounded-3xl
                hover:bg-[#D6F7CB] hover:text-[#55BB33]
                transition-all duration-200 disabled:opacity-50"
            >
              {loadingMore ? t('notifications.loading') || 'Loading...' : t('notifications.load_more') || 'Load more'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}