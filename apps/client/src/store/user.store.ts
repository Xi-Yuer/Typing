import { create } from 'zustand';
import { User } from '@/components/Header/types';
import { UserResponseDto } from '@/request/globals';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  user: UserResponseDto | null;
  token: string | null;
  setUser: (user: UserResponseDto | null) => void;
  setToken: (token: string | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      user: null,
      token: null,
      setUser: user => set({ user }),
      setToken: token => set({ token })
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export const useUser = () => useUserStore(state => state.user);
export const useSetUser = () => useUserStore(state => state.setUser);
