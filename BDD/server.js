import app from './app.js';

const PORT = process.env.PORT || 8090;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
