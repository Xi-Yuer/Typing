import { create } from 'zustand';
import { UserResponseDto } from '@/request/globals';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  user: UserResponseDto | null;
  token: string | null;
  setUser: (user: UserResponseDto | null) => void;
  setToken: (token: string | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      user: null,
      token: null,
      setUser: user => set({ user }),
      setToken: token => set({ token }),
      clearUser: () => set({ user: null, token: null })
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export const useUser = () => useUserStore(state => state.user);
export const useSetUser = () => useUserStore(state => state.setUser);
export const useClearUser = () => useUserStore(state => state.clearUser);
