import { useState, useEffect } from 'react';

export const DEFAULT_PROFILE_PHOTO =
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=240&h=240&q=80';

const STORAGE_KEY = 'smk_pgri_user_profile_photo';

export const getStoredProfilePhoto = (): string => {
  if (typeof window === 'undefined') return DEFAULT_PROFILE_PHOTO;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored || DEFAULT_PROFILE_PHOTO;
};

export const setStoredProfilePhoto = (newPhotoUrl: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, newPhotoUrl);
  window.dispatchEvent(new CustomEvent('profile_photo_changed', { detail: newPhotoUrl }));
};

export const useProfilePhoto = () => {
  const [photo, setPhoto] = useState<string>(getStoredProfilePhoto);

  useEffect(() => {
    const handlePhotoChanged = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setPhoto(customEvent.detail);
      } else {
        setPhoto(getStoredProfilePhoto());
      }
    };

    window.addEventListener('profile_photo_changed', handlePhotoChanged);
    window.addEventListener('storage', handlePhotoChanged);

    return () => {
      window.removeEventListener('profile_photo_changed', handlePhotoChanged);
      window.removeEventListener('storage', handlePhotoChanged);
    };
  }, []);

  const updatePhoto = (newUrl: string) => {
    setStoredProfilePhoto(newUrl);
    setPhoto(newUrl);
  };

  const resetToDefault = () => {
    setStoredProfilePhoto(DEFAULT_PROFILE_PHOTO);
    setPhoto(DEFAULT_PROFILE_PHOTO);
  };

  return {
    photo,
    updatePhoto,
    resetToDefault,
  };
};
