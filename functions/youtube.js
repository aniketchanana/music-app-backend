const express = require('express');
const serverless = require('serverless-http');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
const router = express.Router();

app.use(cors());
app.use('/.netlify/functions/youtube', router);

router.get('/hello', (req, res) => res.send('Hello World!'));
router.get('/song/:id', async (req, res) => {
  try {
    let info = await ytdl.getInfo(req.params.id);
    let audioFormatHigh = ytdl.chooseFormat(info.formats, {
      quality: 'highest',
      filter: 'audioonly',
    });
    let audioFormatLow = ytdl.chooseFormat(info.formats, {
      quality: 'lowest',
      filter: 'audioonly',
    });
    res.status(200).json({
      info,
      audioFormatHigh: audioFormatHigh.url,
      audioFormatLow: audioFormatLow.url,
    });
  } catch (err) {
    if (err instanceof Error)
      res.status(500).send(`internal server error "${err.message}"`);
  }
});

module.exports.handler = serverless(app);
