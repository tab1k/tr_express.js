
import React from 'react'
import { Box, BasePropertyProps, Label } from '@adminjs/design-system'

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { property, record } = props

  const srcImg = record.params[property.name]
  return (
    <Box marginBottom="xxl">
      <Label>{property.label}</Label>
      {srcImg ? (
        <img src={srcImg} width={100} height={100} style={{objectFit: 'cover'}} />
      ) : 'Нет аватара'}
    </Box>
  )
}

export default Edit