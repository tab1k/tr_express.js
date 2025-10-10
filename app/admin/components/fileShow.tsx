
import React from 'react'
import { Box, BasePropertyProps, Label } from '@adminjs/design-system'

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { property, record } = props

  const srcImg = record.params[property.name]
  return (
    <Box marginBottom="xxl">
      <Label>{property.label}</Label>
      {srcImg ? (
        <a href={srcImg} target='_blank' style={{
          color: 'blue',
          textDecoration: 'underline'
        }}  download={true}>Просмотр</a>
      ) : 'no file'}
    </Box>
  )
}

export default Edit