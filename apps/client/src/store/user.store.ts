import { create } from 'zustand';
import { UserResponseDto } from '@/request/globals';
import { persist, createJSONStorage } from 'zustand/middleware';
import React from 'react';

interface UserState {
  user: UserResponseDto | null;
  token: string | null;
  _hasHydrated: boolean;
  setUser: (user: UserResponseDto | null) => void;
  setToken: (token: string | null) => void;
  clearUser: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      user: null,
      token: null,
      _hasHydrated: false,
      setUser: user => set({ user }),
      setToken: token => set({ token }),
      clearUser: () => set({ user: null, token: null }),
      setHasHydrated: state => set({ _hasHydrated: state })
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      }
    }
  )
);

export const useUser = () => useUserStore(state => state.user);
export const useSetUser = () => useUserStore(state => state.setUser);
export const useClearUser = () => useUserStore(state => state.clearUser);

// Hook to manually hydrate the store
export const useHydrateUserStore = () => {
  const store = useUserStore();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      useUserStore.persist.rehydrate();
    }
  }, []);

  return store._hasHydrated;
};
