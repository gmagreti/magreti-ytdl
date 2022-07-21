/* eslint-disable no-useless-escape */
import { useEffect, useState } from 'react'

import { Button, FormElement, Input, Spacer } from '@nextui-org/react'

import { api } from 'services/api'

import * as S from './styles'
import fileDownload from 'js-file-download'
import { toMP4 } from 'utils/download'
import { getVideoID } from 'ytdl-core'

type videoFormats = {
  id: string
  mimeType: string
  qualityLabel: string
  itag: number
  quality: string
  fps: number
  audioQuality: string
  url: string
  hasVideo: boolean
  hasAudio: boolean
  container: string
  contentLength?: string
}

type youtubeDataProps = {
  videoUrl: string
  formats: videoFormats[]
  thumbnail: string
  title: string
}

const Main = ({
  title = 'Youtube Downloader',
  description = 'Baixe seus videos do youtube.'
}) => {
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [youtubeData, setYoutubeData] = useState<youtubeDataProps>()
  const [formats, setFormats] = useState<videoFormats[]>()

  const onInputChange = (value: React.ChangeEvent<FormElement>) => {
    setInputValue(value.target.value)
  }

  const handleSubmit = async () => {
    setLoading((prevState) => !prevState)
    try {
      const { data } = await api.post('/getvideoinfo', { url: inputValue })
      if (data) setLoading((prevState) => !prevState)

      const formats = data.formats.filter(
        (format: videoFormats) => format.container === 'mp4'
      )
      setFormats(formats)
      setYoutubeData(data)
    } catch (error) {
      setLoading((prevState) => !prevState)
      alert(error)
    }
  }

  useEffect(() => {
    console.log(youtubeData)
  }, [youtubeData])

  const handleDownload = async (
    url: string,
    quality: string,
    mimeType: string,
    container: string
  ) => {
    const videoDownload = {
      url: url,
      quality: String(quality),
      mimeType: mimeType,
      container: container
    }
    const parsed_video_id = getVideoID(url).replace(
      /[&\/\\#,+()$~%.'":*?<>{}]/g,
      ''
    )

    // const { data } = await api.get(
    //   `/downloadvideo/url=${url}quality=${quality}mimeType=${mimeType}container=${container}`
    // )
    // const parsed_video_id = getVideoID(url).replace(
    //   /[&\/\\#,+()$~%.'":*?<>{}]/g,
    //   ''
    // )

    // window.open(
    //   `/api/downloadvideo/${parsed_video_id}?quality=${quality}mimeType=${mimeType}container=${container}`,
    //   '_blank'
    // )

    // const { data } = await api.post('/downloadvideo', videoDownload, {
    //   headers: {
    //     responseType: 'blob' // important
    //   }
    // })
    // const file = new File([data], `${youtubeData?.title}.mp4`, {
    //   type: 'video.mp4'
    // })

    // toMP4(data, 'teste', mimeType)

    // console.log(file)

    // fileDownload(file, 'video.mp4')
    window.open(
      `/api/videos/${parsed_video_id}?video_only=false&audio_only=false&bitrate=128&quality=${quality}&format=${container}`,
      '_blank'
    )
  }

  return (
    <S.Wrapper>
      <S.Title>{title}</S.Title>
      <S.Description>{description}</S.Description>
      <S.Description>Video URL: {inputValue}</S.Description>
      <Spacer y={1} />
      <Input
        size="xl"
        placeholder="Primary"
        status="primary"
        width="100%"
        onChange={onInputChange}
      />
      <Spacer y={1} />
      <Button size="xl" auto flat onClick={handleSubmit} disabled={loading}>
        Buscar video
      </Button>
      {formats && (
        <S.WrapperFormat>
          <ul>
            {formats.map((format) => (
              <li key={format.url} style={{ color: '#fff' }}>
                <p>{format.qualityLabel}</p>
                <p>{format.container}</p>
                <p>{format?.contentLength}</p>
                <p>
                  <button
                    onClick={() =>
                      handleDownload(
                        youtubeData!.videoUrl,
                        format.qualityLabel,
                        format.mimeType,
                        format.container
                      )
                    }
                  >
                    DOWNLOAD
                  </button>
                </p>
              </li>
            ))}
          </ul>
        </S.WrapperFormat>
      )}
      {/* <TableComponent /> */}
      {/* <Button size="xl" auto flat onClick={handleDownload} disabled={loading}>
        Buscar video
      </Button> */}
    </S.Wrapper>
  )
}

export default Main
