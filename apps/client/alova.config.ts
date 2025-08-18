module.exports = {
  generator: [
    {
      input: 'http://localhost:3000/doc-json',
      platform: 'swagger',
      output: './src/request'
    }
  ]
};
