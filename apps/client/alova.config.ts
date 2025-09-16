export default {
  generator: [
    {
      input: 'http://localhost:3001/api/doc-json',
      platform: 'swagger',
      output: './src/request'
    }
  ],
  autoUpdate: false
};
