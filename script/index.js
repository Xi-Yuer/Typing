fetch('https://dict.youdao.com/dictvoice?audio=I%20like%20eat%20apple&type=2')
  .then(res => {
    return res.arrayBuffer();
  })
  .then(buffer => {
    console.log(buffer);
  });
