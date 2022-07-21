import { Request, Response } from 'express'
import { FfmpegHandler } from './ffmpegHandler'
import { FileSystemHandler } from './fileSystemHanlder'
import { Random } from './random'
import { FormatMapper } from './video.mapper'
import { YoutubeDownloader } from './youtubeDownloader'
import { pipeline } from 'stream'
import ffmpeg from 'fluent-ffmpeg'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import fileDownload from 'js-file-download'

function clearTemp(file_names: any) {
  file_names.forEach((file: any) => {
    fs.unlink('.' + file, (err) => {
      if (err) throw err
    })
  })
}

export class VideoController {
  async getVideoInfo(req: Request, res: Response) {
    try {
      const { url } = req.body as RequestBody

      if (!url) {
        return res.status(400).json({
          error: 'Missing url'
        })
      }

      const video = await YoutubeDownloader.listFormats(url)

      return res.json({
        ...video,
        formats: video.formats.map((format: any) =>
          FormatMapper.mapReturnType(format)
        )
      })
    } catch (error: any) {
      return res.status(500).json({
        error: error,
        message: error.message
      })
    }
  }

  async downloadVideoButCooler(req: Request, res: Response) {
    const { url, quality, container } = req.body as RequestBody

    if (!url || !quality) {
      return res.status(400).json({
        error: 'Missing url or itag'
      })
    }

    const videoReadableStream = await YoutubeDownloader.downloadVideo(
      url,
      quality
    )

    const audioReadableStream = await YoutubeDownloader.downloadVideo(
      url,
      'highestaudio'
    )

    const video_file_name: string = uuidv4() + '.mp4'

    fs.closeSync(fs.openSync('.' + video_file_name, 'w'))
    const video_write_stream = fs.createWriteStream('.' + video_file_name)
    pipeline(videoReadableStream, video_write_stream, (err) => {
      if (err) console.log(err)
    })
    const audio_file_name: string = uuidv4() + '.mp4'
    fs.closeSync(fs.openSync('.' + audio_file_name, 'w'))
    const audio_write_stream = fs.createWriteStream('.' + audio_file_name)
    pipeline(audioReadableStream, audio_write_stream, (err) => {
      if (err) console.log(err)
    })

    const final_file_name: string = uuidv4() + '.' + container

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
      if (container == 'mp3') {
        return ffmpeg('.' + audio_file_name)
          .input('.' + audio_file_name)
          .save('.' + final_file_name)
          .on('end', () => {
            res.setHeader(
              'Content-Disposition',
              `attachment; filename='video.mp4'`
            )
            pipeline(fs.createReadStream('.' + final_file_name), res, (err) => {
              if (err) console.log(err)
            })
            res.on('finish', () =>
              clearTemp([audio_file_name, video_file_name])
            )
          })
      }
      return ffmpeg('.' + video_file_name)
        .on('start', (cmd) => console.log(cmd))
        .input('.' + audio_file_name)
        .addOptions(['-c copy'])
        .save('.' + final_file_name)
        .on('end', (stream) => {
          res.setHeader(
            'Content-Disposition',
            `attachment; filename='video.mp4'`
          )
          pipeline(fs.createReadStream('.' + final_file_name), res, (err) => {
            if (err) console.log(err)
          })
          res.on('finish', () => {
            console.log(final_file_name)
            console.log(stream)

            clearTemp([audio_file_name, video_file_name])
          })
        })
    })
  }
}

interface RequestBody {
  url: string
  quality: string
  mimeType: string
  container: string
  contentLength: string
}
