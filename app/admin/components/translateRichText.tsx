
import React, { useEffect, useState, useCallback  } from 'react'
//@ts-ignore
import { Label, Box, FormGroup, BasePropertyProps, RichTextEditor, Button, Input } from '@adminjs/design-system'
import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { property, record, onChange, msg } = props
  let nameTranslate = record.populated[property.name]?.params || {}
  let kzT = "", ruT = "", enT = "", zhT = ""
  //@ts-ignore
  if (nameTranslate !== {}) {
    kzT = nameTranslate.kz,
    ruT = nameTranslate.ru,
    enT = nameTranslate.en,
    zhT = nameTranslate.zh
  }
  const error = record.errors && record.errors[property.path]
  
  const currentId = record.params[property.name]
  const [activeTab, setActiveTab] = useState("kz");
  const [value, setValue] = useState('');
  const handleUpdateKz = useCallback((newValue: string) => {
    console.log('newValue', newValue);
    
    kzT = newValue
    onChange(property.name + 'objlang', JSON.stringify({kz:kzT,ru:ruT,en:enT,zh:zhT}))
  }, [])
  const handleUpdateRu = useCallback((newValue: string) => {
    ruT = newValue
    onChange(property.name + 'objlang', JSON.stringify({kz:kzT,ru:ruT,en:enT,zh:zhT}))
  }, [])
  const handleUpdateEn = useCallback((newValue: string) => {
    enT = newValue
    onChange(property.name + 'objlang', JSON.stringify({kz:kzT,ru:ruT,en:enT,zh:zhT}))
  }, [])
  const handleUpdateZh = useCallback((newValue: string) => {
    zhT = newValue
    onChange(property.name + 'objlang', JSON.stringify({kz:kzT,ru:ruT,en:enT,zh:zhT}))
  }, [])

  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    }
  }
  
  return (
    <Box marginBottom="xxl">
      <FormGroup>
      <Label>{property.label}</Label>
        <Box flex width={[1, 1, 1, 1]}>
          <Box width={[1, 1, 1, 1]}>
            <Button type={'button'} mr={5} mb={20} variant={activeTab === 'kz' ? 'primary': 'default'} onClick={() => {setActiveTab('kz')}} >
              Қазақша
            </Button>
            <Button type={'button'} mr={5} mb={20} variant={activeTab === 'ru' ? 'primary': 'default'} onClick={() => {setActiveTab('ru')}} >
              Русский
            </Button>
            <Button type={'button'} mr={5} mb={20} variant={activeTab === 'en' ? 'primary': 'default'} onClick={() => {setActiveTab('en')}} >
              Английский
            </Button>
            <Button type={'button'} mr={5} mb={20} variant={activeTab === 'zh' ? 'primary': 'default'} onClick={() => {setActiveTab('zh')}} >
              Китайский
            </Button>
            {/* <Button type={'button'} mr={5} mb={20} variant={activeTab === 'en' ? 'primary': 'default'} onClick={() => {setActiveTab('en')}} >
              English
            </Button> */}
            <div style={activeTab !== 'kz' ? {display: 'none'} : {display: 'block'}}>
               {/* <RichTextEditor value={kzT}  onChange={handleUpdateKz} options={property.props} /> */}
               <ReactQuill modules={modules}  theme="snow" value={kzT} onChange={handleUpdateKz} />
            </div>
            <div style={activeTab !== 'ru' ? {display: 'none'} : {display: 'block'}}>
              <RichTextEditor value={ruT}  onChange={handleUpdateRu} options={property.props} />
            </div>
            <div style={activeTab !== 'en' ? {display: 'none'} : {display: 'block'}}>
              <RichTextEditor value={enT}  onChange={handleUpdateEn} options={property.props} />
            </div>
            <div style={activeTab !== 'zh' ? {display: 'none'} : {display: 'block'}}>
              <RichTextEditor value={zhT}  onChange={handleUpdateZh} options={property.props} />
            </div>
          </Box>
        </Box>
      </FormGroup>
    </Box>
  )
}

export default Edit