import { useEffect, useMemo, useState } from 'react';

const PROFILE_STORAGE_KEY = 'sahla_profile_info';

export default function useProfileInfo(initialUser = {}) {
  const fallbackProfile = useMemo(() => ({
    pfp: initialUser.pfp || '',
    userName: initialUser.userName || '',
    email: initialUser.email || '',
    address: initialUser.address ?? '',
    age: initialUser.age ?? '',
    password: initialUser.password || '',
  }), [initialUser]);

  const [profileInfo, setProfileInfo] = useState(() => {
    if (typeof window === 'undefined') {
      return fallbackProfile;
    }

    try {
      const persisted = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!persisted) {
        return fallbackProfile;
      }

      const parsed = JSON.parse(persisted);
      return {
        ...fallbackProfile,
        ...parsed,
      };
    } catch {
      return fallbackProfile;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileInfo));
    } catch {
      // Ignore storage errors to keep UI responsive.
    }
  }, [profileInfo]);

  const updateProfileInfo = (nextValues) => {
    setProfileInfo((prev) => ({
      ...prev,
      userName: nextValues.userName,
      email: nextValues.email,
      address: nextValues.address,
      age: nextValues.age,
      password: nextValues.password || prev.password,
    }));
  };

  const updateProfilePhoto = (nextPfp) => {
    setProfileInfo((prev) => ({ ...prev, pfp: nextPfp }));
  };

  return {
    profileInfo,
    updateProfileInfo,
    updateProfilePhoto,
  };
}
