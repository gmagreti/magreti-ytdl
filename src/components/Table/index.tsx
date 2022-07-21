import { Table, Row, Col, Tooltip, Text } from '@nextui-org/react'
import * as Styled from './styles'

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

type TableProps = {
  videoFormats: videoFormats[]
}

export function TableComponent({ videoFormats }: TableProps) {
  console.log(videoFormats)

  const columns = [
    { name: 'Quality', uid: 'quality' },
    { name: 'Format', uid: 'format' },
    { name: 'File Size', uid: 'filesize' },
    { name: 'Action', uid: 'action' }
  ]

  const renderCell = (data: any, columnKey: any) => {
    const cellValue = data[columnKey]
    switch (columnKey) {
      case 'quality':
        return (
          <Text b size={14} css={{ tt: 'capitalize' }}>
            {data.qualityLabel}
          </Text>
        )
      case 'format':
        return (
          <Text b size={14} css={{ tt: 'capitalize' }}>
            {data.container}
          </Text>
        )

      case 'filesize':
        return (
          <Text b size={14} css={{ tt: 'capitalize' }}>
            {data?.contentLength}
          </Text>
        )

      case 'action':
        return (
          <Row justify="center" align="center">
            <Col css={{ d: 'flex' }}>
              <Tooltip content="Details">
                <Styled.IconButton
                  onClick={() => console.log('View data', data.url)}
                >
                  Download
                </Styled.IconButton>
              </Tooltip>
            </Col>
          </Row>
        )
      default:
        return cellValue
    }
  }

  return (
    <Table
      aria-label="Example table with custom cells"
      css={{
        height: 'auto',
        minWidth: '100%'
      }}
      selectionMode="none"
    >
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column
            key={column.uid}
            hideHeader={column.uid === 'action'}
            align={column.uid === 'action' ? 'center' : 'start'}
          >
            {column.name}
          </Table.Column>
        )}
      </Table.Header>
      <Table.Body items={[]}>
        {(item) => (
          <Table.Row>
            {(columnKey) => (
              <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
            )}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}
