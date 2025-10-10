import React, { useEffect, useState, useCallback, FormEvent } from 'react'
import { Label, Box, FormGroup, BasePropertyProps, RichTextEditor, Button, Input } from '@adminjs/design-system'
import ReactQuill from 'react-quill';
const Edit: React.FC<BasePropertyProps> = (props) => {
  const { property, record, onChange, msg } = props
  let nameTranslate = record.populated[property.name]?.params || {}

  const [kzText, setValueKz] = useState("")
  const [enText, setValueEn] = useState("")
  const [ruText, setValueRu] = useState("")
  const [zhText, setValueZh] = useState("")
  const currentId = record.params[property.name]
  const [activeTab, setActiveTab] = useState("kz");

  useEffect(() => {
    setValueKz(nameTranslate.kz || '')
    setValueEn(nameTranslate.en || '')
    setValueRu(nameTranslate.ru || '')
    setValueZh(nameTranslate.zh || '')
  }, []);

  const handleDropZoneChange = () => {
    const objlang: Record<string, string> = {};
    if (kzText) {
      objlang.kz = kzText;
    }
    if (enText) {
      objlang.en = enText;
    }
    if (ruText) {
      objlang.ru = ruText;
    }
    if (zhText) {
      objlang.zh = zhText;
    }
    onChange(property.name + 'objlang', JSON.stringify(objlang))
  }

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
            <Button type={'button'} mr={5} mb={20} variant={activeTab === 'kz' ? 'primary' : 'default'} onClick={() => { setActiveTab('kz') }} >
              Қазақша
            </Button>
            <Button type={'button'} mr={5} mb={20} variant={activeTab === 'ru' ? 'primary' : 'default'} onClick={() => { setActiveTab('ru') }} >
              Русский
            </Button>
            <Button type={'button'} mr={5} mb={20} variant={activeTab === 'en' ? 'primary' : 'default'} onClick={() => { setActiveTab('en') }} >
              Английский
            </Button>
            <Button type={'button'} mr={5} mb={20} variant={activeTab === 'zh' ? 'primary' : 'default'} onClick={() => { setActiveTab('zh') }} >
              Китайский
            </Button>
            <div style={activeTab !== 'kz' ? { display: 'none' } : { display: 'block' }} onBlur={handleDropZoneChange}>
              <ReactQuill modules={modules}  theme="snow" value={kzText || ''} onChange={setValueKz}  
                 />
            </div>
            <div style={activeTab !== 'ru' ? { display: 'none' } : { display: 'block' }} onBlur={handleDropZoneChange}>
              <ReactQuill modules={modules}  theme="snow" value={ruText || ''} onChange={setValueRu} />
            </div>
            <div style={activeTab !== 'en' ? { display: 'none' } : { display: 'block' }} onBlur={handleDropZoneChange}>
              <ReactQuill modules={modules}  theme="snow" value={enText || ''} onChange={setValueEn} />
            </div>
            <div style={activeTab !== 'zh' ? { display: 'none' } : { display: 'block' }} onBlur={handleDropZoneChange}>
              <ReactQuill modules={modules}  theme="snow" value={zhText || ''} onChange={setValueZh} />
            </div>
          </Box>
        </Box>
      </FormGroup>
    </Box>
  )
}

export default Edit