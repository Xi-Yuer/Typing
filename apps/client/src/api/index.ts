export const getAudio = (word: string) => {
  return fetch(`https://dict.youdao.com/dictvoice?audio=${word}&type=2`);
};
