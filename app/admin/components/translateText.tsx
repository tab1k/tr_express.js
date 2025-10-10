import React, { useEffect, useState } from 'react'
//@ts-ignore
import { Label, Box, FormGroup, BasePropertyProps, RichTextEditor, Button, Input } from '@adminjs/design-system'
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
    // console.log('nameTranslate.kz',nameTranslate.kz);
    
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
            <div style={activeTab !== 'kz' ? { display: 'none' } : { display: 'block' }}>
              <Input
                width={'100%'}
                value={kzText || ''}
                //@ts-ignore
                onInput={(e) => { (setValueKz(e.target.value))}}
                onBlur={handleDropZoneChange}
              />
            </div>
            <div style={activeTab !== 'ru' ? { display: 'none' } : { display: 'block' }}>
              <Input
                width={'100%'}
                value={ruText || ''}
                //@ts-ignore
                onInput={(e) => { (setValueRu(e.target.value)) }}
                onBlur={handleDropZoneChange}
              />
            </div>
            <div style={activeTab !== 'en' ? { display: 'none' } : { display: 'block' }}>
              <Input
                width={'100%'}
                value={enText || ''}
                //@ts-ignore
                onInput={(e) => { (setValueEn(e.target.value)) }}
                onBlur={handleDropZoneChange}
              />
            </div>
            <div style={activeTab !== 'zh' ? { display: 'none' } : { display: 'block' }}>
              <Input
                width={'100%'}
                value={zhText || ''}
                //@ts-ignore
                onInput={(e) => { (setValueZh(e.target.value)) }}
                onBlur={handleDropZoneChange}
              />
            </div>
          </Box>
        </Box>
      </FormGroup>
    </Box>
  )
}

export default Edit