import { useEffect, useState } from 'react';
import { getStarsCount } from '../utils';

const CACHE_KEY = 'github_stars_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export const useStars = () => {
  const [stars, setStars] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        // 确保在浏览器环境中
        if (typeof window === 'undefined') return;

        const cachedData = localStorage.getItem(CACHE_KEY);

        if (cachedData) {
          const { count, timestamp } = JSON.parse(cachedData);
          const now = Date.now();

          if (now - timestamp < CACHE_DURATION) {
            setStars(count);
            setIsHydrated(true);
            return;
          }
        }

        const count = await getStarsCount();

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            count,
            timestamp: Date.now()
          })
        );

        setStars(Number(count));
        setIsHydrated(true);
      } catch {
        if (typeof window !== 'undefined') {
          const cachedData = localStorage.getItem(CACHE_KEY);
          if (cachedData) {
            const { count } = JSON.parse(cachedData);
            setStars(count);
          }
        }
        setIsHydrated(true);
      }
    };

    fetchStars();
  }, []);

  return { stars, isHydrated };
};
