import path from 'path';

export const serveImage = (req, res) => {
  const filename = req.params.filename;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, max-age=31536000');

  const options = {
    root: path.resolve('./public'),
  };

  res.sendFile(filename, options, (err) => {
    if (err) {
      console.error(err);
      res.status(err.status || 500).send('Erreur lors de la récupération de l\'image');
    }
  });
};
