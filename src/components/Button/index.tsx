import { useRef, useState } from 'react'
import * as Styled from './styles'

export type BoxValueProps = {
  id?: number
  x: number
  y: number
  circleSize?: number
  animationValue?: number
}

export type ButtonProps = {
  children: React.ReactNode
  buttonType?: 'primary' | 'secondary' | 'minimal'
}

const ANIMATION_MS = 800
const CIRCLE_SIZE = 100

const Button = ({ children, buttonType = 'primary' }: ButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [boxValue, setBoxValue] = useState<BoxValueProps[]>([])

  const shift = (array: BoxValueProps[]) => {
    const newArray = [...array]
    newArray.shift()
    return newArray
  }

  const handleGetBoxValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    const box = buttonRef.current!.getBoundingClientRect()
    const eixoX = event.clientX - box.left - CIRCLE_SIZE / 2
    const eixoY = event.clientY - box.top - CIRCLE_SIZE / 2
    const newId = Math.random()

    setBoxValue([...boxValue, { id: newId, x: eixoX, y: eixoY }])

    setTimeout(() => {
      setBoxValue(shift(boxValue))
    }, ANIMATION_MS)
  }

  return (
    <Styled.Wrapper
      buttonType={buttonType}
      ref={buttonRef}
      onClick={handleGetBoxValue}
    >
      {boxValue.map((effect) => (
        <Styled.RippleEffect
          key={effect.id}
          x={effect.x}
          y={effect.y}
          circleSize={CIRCLE_SIZE}
        />
      ))}
      {children}
    </Styled.Wrapper>
  )
}

export default Button
