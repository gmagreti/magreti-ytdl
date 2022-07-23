import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffmpeg from 'fluent-ffmpeg'

ffmpeg.setFfmpegPath(ffmpegPath.path)
import ytdl from 'ytdl-core'

import fs from 'fs'
import { pipeline } from 'stream'
import { v4 as uuidv4 } from 'uuid'
import { NextApiRequest, NextApiResponse } from 'next'

function getVideoStream(video_id: any, quality: any) {
  const video_stream = ytdl(video_id, {
    filter: (format) => {
      if (format.hasAudio) return false
      if (format.qualityLabel != quality) return false

      return true
    }
  })
  return video_stream
}
function getAudioStream(video_id: any) {
  const audio_stream = ytdl(video_id, 'audioonly')
  return audio_stream
}

function clearTemp(file_names: any[]) {
  file_names.forEach((file: string) => {
    fs.unlink('.' + file, (err) => {
      if (err) throw err
    })
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // params video_id
  const video_id: string | string[] = req.query.video_id

  if (typeof video_id != 'string')
    return res.status(400).send({ message: 'video_id cannot be a list' })
  if (!video_id || !ytdl.validateID(video_id))
    return res
      .status(404)
      .send({ message: 'invalid id or the video does not exist' })

  // params quality
  const quality: string | string[] = req.query.quality || '720p'

  if (typeof quality != 'string')
    return res.status(400).send({ message: 'quality cannot be a list' })

  let audioBitrate = 128
  if (typeof req.query.bitrate == 'string')
    audioBitrate = parseInt(req.query.bitrate)

  // params quality
  const format: string | string[] = req.query.format || 'mp4'
  if (typeof format != 'string')
    return res.status(400).send({ message: 'format cannot be a list' })

  const videoUrl = `https://www.youtube.com/watch?v=${video_id}`

  const video_stream = getVideoStream(video_id, quality)
  const audio_stream = getAudioStream(video_id)

  const video_file_name: string = uuidv4() + '.mp4'

  fs.closeSync(fs.openSync('.' + video_file_name, 'w'))
  const video_write_stream = fs.createWriteStream('.' + video_file_name)
  pipeline(video_stream, video_write_stream, (err) => {
    if (err) console.log(err)
  })
  const audio_file_name: string = uuidv4() + '.mp4'
  fs.closeSync(fs.openSync('.' + audio_file_name, 'w'))
  const audio_write_stream = fs.createWriteStream('.' + audio_file_name)
  pipeline(audio_stream, audio_write_stream, (err) => {
    if (err) console.log(err)
  })

  const final_file_name: string = uuidv4() + '.' + format

  const video_write_promise: Promise<any> = new Promise(function (
    resolve,
    reject
  ) {
    video_write_stream.on('finish', resolve)
    video_write_stream.on('error', reject)
  })
  const audio_write_promise: Promise<any> = new Promise(function (
    resolve,
    reject
  ) {
    audio_write_stream.on('finish', resolve)
    audio_write_stream.on('error', reject)
  })

  Promise.all([video_write_promise, audio_write_promise]).then(() => {
    if (format == 'mp3') {
      return ffmpeg('.' + audio_file_name)
        .input('.' + audio_file_name)
        .save('.' + final_file_name)
        .on('end', () => {
          res.setHeader(
            'Content-Disposition',
            `attachment; filename=${'content.'}${format}`
          )
          pipeline(fs.createReadStream('.' + final_file_name), res, (err) => {
            if (err) console.log(err)
          })
          res.on('finish', () =>
            clearTemp([audio_file_name, video_file_name, final_file_name])
          )
        })
    }
    return ffmpeg('.' + video_file_name)
      .on('start', (cmd) => console.log(cmd))
      .input('.' + audio_file_name)
      .addOptions(['-c copy'])
      .save('.' + final_file_name)
      .on('end', () => {
        res.setHeader(
          'Content-Disposition',
          `attachment; filename=${final_file_name}${format}`
        )
        pipeline(fs.createReadStream('.' + final_file_name), res, (err) => {
          if (err) console.log(err)
        })
        res.on('finish', () =>
          clearTemp([audio_file_name, video_file_name, final_file_name])
        )
      })
  })

  return
}
