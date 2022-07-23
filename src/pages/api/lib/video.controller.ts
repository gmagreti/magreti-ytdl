import { Request, Response } from 'express'
import { FormatMapper } from './video.mapper'
import { YoutubeDownloader } from './youtubeDownloader'
import fs from 'fs'
import { FfmpegHandler } from './ffmpegHandler'

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
    const { url, quality, container, fileName }: any = req.query

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

    const { ffmpegProcess, videoPath } = FfmpegHandler.convertVideo(
      videoReadableStream,
      audioReadableStream,
      fileName
    )

    ffmpegProcess.on('exit', (code: number) => {
      if (code === 0) {
        return res.status(200).json({ message: videoPath })
      } else {
        return res.status(500).json({
          error: 'Failed to convert video'
        })
      }
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
