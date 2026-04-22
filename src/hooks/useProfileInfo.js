import { useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '../utilities/data/storageKeys';

// LOCAL STORAGE (backend migration): key for cached profile settings in browser.
const PROFILE_STORAGE_KEY = STORAGE_KEYS.profile;

export default function useProfileInfo(initialUser = {}) {
  // Accepts either raw backend-shaped user data (username/avatarUrl)
  // or already-normalized app user data (userName/pfp).
  const normalizedInitialUser = useMemo(() => ({
    pfp: initialUser.pfp || initialUser.avatarUrl || '',
    userName: initialUser.userName || initialUser.username || '',
    email: initialUser.email || '',
    address: initialUser.address ?? '',
    age: initialUser.age ?? '',
  }), [initialUser]);

  const fallbackProfile = useMemo(() => ({
    pfp: normalizedInitialUser.pfp,
    userName: normalizedInitialUser.userName,
    email: normalizedInitialUser.email,
    address: normalizedInitialUser.address,
    age: normalizedInitialUser.age,
  }), [normalizedInitialUser]);

  const [profileInfo, setProfileInfo] = useState(() => {
    if (typeof window === 'undefined') {
      return fallbackProfile;
    }

    try {
      // LOCAL STORAGE (backend migration): profile bootstrap read.
      const persisted = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!persisted) {
        return fallbackProfile;
      }

      const parsed = JSON.parse(persisted);
      const { password, ...parsedWithoutPassword } = parsed || {};
      return {
        ...fallbackProfile,
        ...parsedWithoutPassword,
      };
    } catch {
      return fallbackProfile;
    }
  });

  useEffect(() => {
    try {
      // LOCAL STORAGE (backend migration): profile write-through persistence.
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
