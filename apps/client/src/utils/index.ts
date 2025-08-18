const formatNumber = (num: number) => {
  if (num < 1000) return num.toString();

  const rounded = Math.ceil(num / 100) * 100;
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(rounded);
};

export const getStarsCount = async () => {
  try {
    const response = await fetch('https://api.github.com/repos/Xi-Yuer/GO-CMS');
    const data = await response.json();
    return String(formatNumber(data.stargazers_count)).toUpperCase();
  } catch (error) {
    console.error('Error fetching stargazers count:', error);
    return null;
  }
};
