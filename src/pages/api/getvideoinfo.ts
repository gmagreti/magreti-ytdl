import { Request, Response } from 'express'
import { VideoController } from './lib/video.controller'

const videoController = new VideoController()

export default async function getVideo(req: Request, res: Response) {
  videoController.getVideoInfo(req, res)
}
