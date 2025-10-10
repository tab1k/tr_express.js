import React, { useEffect, useState } from 'react'
import { Label, Box, DropZone, BasePropertyProps, DropZoneProps, DropZoneItem } from '@adminjs/design-system'
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
        <DropZoneItem src={photoToUpload} />
      )}
    </Box>
  )
}

export default Edit 