import styled from 'styled-components'
import { styled as styledNextUI } from '@nextui-org/react'

export const Container = styled.div``

export const IconButton = styledNextUI('button', {
  dflex: 'center',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  padding: '0',
  margin: '0',
  bg: 'transparent',
  transition: '$default',
  '&:hover': {
    opacity: '0.8'
  },
  '&:active': {
    opacity: '0.6'
  }
})
