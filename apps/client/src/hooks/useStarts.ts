import { useEffect, useState } from 'react';
import { getStarsCount } from '../utils';

const CACHE_KEY = 'github_stars_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export const useStars = () => {
  const [stars, setStars] = useState(0);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);

        if (cachedData) {
          const { count, timestamp } = JSON.parse(cachedData);
          const now = Date.now();

          if (now - timestamp < CACHE_DURATION) {
            setStars(count);
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
      } catch {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { count } = JSON.parse(cachedData);
          setStars(count);
        }
      }
    };

    fetchStars();
  }, []);

  return stars;
};
