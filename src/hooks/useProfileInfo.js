import { useEffect, useMemo, useState, useRef } from "react";
import { STORAGE_KEYS } from "../utilities/data/storageKeys";

const PROFILE_STORAGE_KEY = STORAGE_KEYS.profile;

export default function useProfileInfo(initialUser = {}) {
  const safeUser = initialUser || {}; // ← guard against null/undefined

  const normalizedInitialUser = useMemo(
    () => ({
      pfp: safeUser.pfp || safeUser.avatarUrl || "",
      userName: safeUser.userName || safeUser.username || "",
      email: safeUser.email || "",
      address: safeUser.address ?? "",
      age: safeUser.age ?? "",
    }),
    [
      safeUser.pfp,
      safeUser.avatarUrl,
      safeUser.userName,
      safeUser.username,
      safeUser.email,
      safeUser.address,
      safeUser.age,
    ],
  );

  const [profileInfo, setProfileInfo] = useState(normalizedInitialUser);

  // Use a ref to track if this is the first mount
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Skip on first mount — state already initialized correctly
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setProfileInfo(normalizedInitialUser);
  }, [normalizedInitialUser]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(profileInfo),
      );
    } catch {
      // Ignore storage errors
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

  return { profileInfo, updateProfileInfo, updateProfilePhoto };
}
