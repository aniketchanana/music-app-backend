const express = require('express');
const app = express();
const ytdl = require('ytdl-core');
const cors = require('cors');

app.use(cors());

app.get('/song/:id', async (req, res) => {
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
    // console.error(error);
    if (err instanceof Error)
      res.status(500).send(`internal server error "${err.message}"`);
  }
});

app.listen(process.env.PORT || 3000, () => console.log('server is running'));
