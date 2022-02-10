const express = require('express');
const { readFile, existsSync } = require('fs');
const Path = require('path');
const { Octokit } = require("@octokit/core");
const app = express();
const api = express.Router();
const octokit = new Octokit();

const markdownToHtml = (file) => {
    return new Promise((resolve, reject) => {
        readFile(file, 'utf8', function (err, data) {
            if (err) {
              return reject(err);
            }
            
            octokit.request('POST /markdown', {
              text: data
            }).then(d => {
              resolve(d.data);
            }).catch(e => reject(e));

          });
      })
}

api.get('/post/:slug', (req, res) => {
  const slug = req.params.slug;
  const filePath = `./content/${slug}.md`;
  const path = Path.join(__dirname, filePath);
  const fileExists = existsSync(path);
  
  if (!fileExists) {
    res.status(404).send('Page not found');
    return;
  }

  markdownToHtml(filePath)
  .then((d) => {
    res.json({
      content: d,
    });
  })
  .catch((e) => {
    res.status(400).send(e)
  });
});

app.use('/api', api);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(
    `Backend is runing on: http://localhost:${port}`
  );
});