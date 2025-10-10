import React, { useEffect, useState } from 'react'
import { Label, Box, DropZone, Icon, BasePropertyProps, DropZoneProps, DropZoneItem } from '@adminjs/design-system'
import { ApiClient } from 'adminjs'

const Edit: React.FC<BasePropertyProps> = (props) => {
  // const [data, setData] = useState(null)
  // const api = new ApiClient()
  // useEffect(() => {
  //  api.getDashboard()
  //   .then((response) => {  
  //    console.log(response.data);
     
  //    setData(response.data.length) // { message: 'Hello World' }
  //   })
  //   .catch((error) => {
  //    // handle any errors
  //   });
  // }, []);
  const { property, onChange, record, msg } = props

  const handleDropZoneChange: DropZoneProps['onChange'] = (files) => {
    onChange(property.name, files[0])
  }
  
  // const uploadedPhoto = record.params.image
  const photoToUpload = record.params[property.name]

  return (
    <Box marginBottom="xxl">
      <Label>{property.label}</Label>
      <DropZone multiple={false} onChange={handleDropZoneChange}/>
      {typeof photoToUpload === 'string' && (
      <>
        {photoToUpload.endsWith('.pdf') || photoToUpload.endsWith('.docx') || photoToUpload.endsWith('.svg') || photoToUpload.endsWith('.xlsx') ? (
          <Box mt={12}>
            <Icon icon={'Document'} />
            <a href={photoToUpload} target="_blank" rel="noopener noreferrer">
              Скачать PDF ({photoToUpload.split('/')[2]})
            </a>
          </Box>
        ) : (
          <DropZoneItem src={photoToUpload} />
        )}
      </>
    )}
    </Box>
  )
}

export default Edit 