const express = require('express');
const app = express();
const ytdl = require('ytdl-core');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');

app.use(cors());

const getAudio = (videoId) =>
  new Promise((res, rej) => {
    youtubedl(`https://www.youtube.com/watch?v=${videoId}`, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
    }).then((output) => {
      const audioOutput = output.requested_formats?.filter(
        (format) => format.video_ext === 'none' && format.aspect_ratio === null
      );
      res(audioOutput[0]);
    });
  });

const map = {};

app.get('/song/:id', async (req, res) => {
  try {
    const videoId = req.params.id;
    if (map[videoId]) {
      res.status(200).json({
        audioUrl: map[videoId],
      });
    }
    let audioFormat = await getAudio(videoId);
    if (!audioFormat?.url) {
      throw new Error();
    }
    map[videoId] = audioFormat?.url;
    res.status(200).json({
      audioUrl: audioFormat?.url || '',
    });
  } catch (err) {
    // console.error(error);
    if (err instanceof Error)
      res.status(500).send(`internal server error "${err.message}"`);
  }
});

app.listen(process.env.PORT || 3000, () => console.log('server is running'));
