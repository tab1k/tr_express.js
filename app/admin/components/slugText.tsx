import React, { useEffect, useState } from 'react'
//@ts-ignore
import { Label, Box, FormGroup, BasePropertyProps, RichTextEditor, Button, Input } from '@adminjs/design-system'
import slugify from "slugify"
const Edit: React.FC<BasePropertyProps> = (props) => {
  const { property, record, onChange, msg } = props
  let nameTranslate = record.populated['title']?.params || {}
  let slugTranslate = record.populated[property.name]?.params || {}

  const [kzText, setValueKz] = useState("")
  const [enText, setValueEn] = useState("")
  const [ruText, setValueRu] = useState("")
  const [zhText, setValueZh] = useState("")

  const [kzSlug, setValueKzSlug] = useState("")
  const [enSlug, setValueEnSlug] = useState("")
  const [ruSlug, setValueRuSlug] = useState("")
  const [zhSlug, setValueZhSlug] = useState("")

  const currentId = record.params[property.name]
  const [activeTab, setActiveTab] = useState("kz");
  const [activeTab1, setActiveTab1] = useState("kz");

  useEffect(() => {
    setValueKz(nameTranslate.kz || '')
    setValueEn(nameTranslate.en || '')
    setValueRu(nameTranslate.ru || '')
    setValueZh(nameTranslate.zh || '')
    setValueKzSlug(slugTranslate.kz || '')
    setValueEnSlug(slugTranslate.en || '')
    setValueRuSlug(slugTranslate.ru || '')
    setValueZhSlug(slugTranslate.zh || '')
  }, []);
  const handleDropZoneChange = () => {
    // console.log('nameTranslate.kz',nameTranslate.kz);
    
    const objlang: Record<string, string> = {};
    if (kzText) {
      const words = kzText.split(' ').slice(0, 5).join(' ');
      objlang.kz = kzText;
      setValueKzSlug(slugify(words, {
        lower: true
      }))
    }
    if (enText) {
      const words = enText.split(' ').slice(0, 5).join(' ');
      objlang.en = enText;
      objlang.zh = enText;
      setValueZhSlug(slugify(words, {
        lower: true
      }))
      setValueEnSlug(slugify(words, {
        lower: true
      }))
    }
    if (ruText) {
      const words = ruText.split(' ').slice(0, 5).join(' ');
      objlang.ru = ruText;
      setValueRuSlug(slugify(words, {
        lower: true
      }))
    }
    if (zhText) {
      const words = enText.split(' ').slice(0, 5).join(' ');
      objlang.zh = enText;
      setValueZhSlug(slugify(words, {
        lower: true
      }))
    }

    const objlang1: Record<string, string> = {};
    if (kzSlug) {
      objlang1.kz = kzSlug;
    }
    if (enSlug) {
      objlang1.en = enSlug;
    }
    if (ruSlug) {
      objlang1.ru = ruSlug;
    }
    if (zhSlug) {
      objlang1.zh = zhSlug;
    }
    
    onChange('titleobjlang', JSON.stringify(objlang))
    onChange(property.name + 'objlang', JSON.stringify(objlang1))
  }


  return (
    <Box marginBottom="xxl">
      <FormGroup>
        <Label>Заголовок</Label>
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
                onInput={(e) => { (setValueKz(e.target.value)) }}
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
      <FormGroup>
        <Label>Slug</Label>
        <Box flex width={[1, 1, 1, 1]}>
          <Box width={[1, 1, 1, 1]}>
            <Button type={'button'} mr={5} mb={20} variant={activeTab1 === 'kz' ? 'primary' : 'default'} onClick={() => { setActiveTab1('kz') }} >
              Қазақша
            </Button>
            <Button type={'button'} mr={5} mb={20} variant={activeTab1 === 'ru' ? 'primary' : 'default'} onClick={() => { setActiveTab1('ru') }} >
              Русский
            </Button>
            <Button type={'button'} mr={5} mb={20} variant={activeTab1 === 'en' ? 'primary' : 'default'} onClick={() => { setActiveTab1('en') }} >
              Английский
            </Button>
            <Button type={'button'} mr={5} mb={20} variant={activeTab1 === 'zh' ? 'primary' : 'default'} onClick={() => { setActiveTab1('zh') }} >
              Китайский
            </Button>
            <div style={activeTab1 !== 'kz' ? { display: 'none' } : { display: 'block' }}>
              <Input
                width={'100%'}
                value={kzSlug || ''}
                readOnly={true}
              />
            </div>
            <div style={activeTab1 !== 'ru' ? { display: 'none' } : { display: 'block' }}>
              <Input
                width={'100%'}
                value={ruSlug || ''}
                readOnly={true}
              />
            </div>
            <div style={activeTab1 !== 'en' ? { display: 'none' } : { display: 'block' }}>
              <Input
                width={'100%'}
                value={enSlug || ''}
                readOnly={true}
              />
            </div>
            <div style={activeTab1 !== 'zh' ? { display: 'none' } : { display: 'block' }}>
              <Input
                width={'100%'}
                value={zhSlug || ''}
                readOnly={true}
              />
            </div>
          </Box>
        </Box>
      </FormGroup>
    </Box>
  )
}

export default Edit