import React from 'react'
import { ThreeEvent } from '@react-three/fiber'
import { Object3D, ColorRepresentation } from 'three'

export type PrimitiveProps = {
  object: Object3D
  onClick?: (e: ThreeEvent<MouseEvent>) => void
}

export const Primitive: React.FC<PrimitiveProps> = (props) => {
  // Use runtime string element but keep external typing strict
  return React.createElement('primitive' as any, props)
}

export type AmbientLightProps = {
  intensity?: number
  color?: ColorRepresentation
}

export const AmbientLight: React.FC<AmbientLightProps> = (props) => {
  return React.createElement('ambientLight' as any, props)
}

export type DirectionalLightProps = {
  position?: [number, number, number]
  intensity?: number
  color?: ColorRepresentation
}

export const DirectionalLight: React.FC<DirectionalLightProps> = (props) => {
  return React.createElement('directionalLight' as any, props)
}
