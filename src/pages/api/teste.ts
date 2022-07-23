import { Request, Response } from 'express'

export default async function getVideo(req: Request, res: Response) {
  const videoPath = 'static/f6db9550-e790-4eb8-8ea6-eec4c5d33eed.mp4'
  console.log(videoPath)

  res.download(videoPath)
}
