const { ComponentLoader } = require('adminjs')

const componentLoader = new ComponentLoader()


exports.Components = {
 UploadImage: componentLoader.add('UploadImage', `./uploadImage.tsx`),
 FileList: componentLoader.add('FileList', `./fileList.tsx`),
 FileShow: componentLoader.add('FileShow', `./fileShow.tsx`),
 ImageList: componentLoader.add('ImageList', `./imageList.tsx`),
 ImageShow: componentLoader.add('ImageShow', `./imageShow.tsx`),
 Dashboard: componentLoader.add('Dashboard', './dashboard'),
 SlugText: componentLoader.add('SlugText', './slugText'),
 TranslateText: componentLoader.add('TranslateText', './translateText'),
 CountriesCity: componentLoader.add('CountriesCity', './CountriesCity'),
 PointsList: componentLoader.add('PointsList', './PointsList'),
 PointsList1: componentLoader.add('PointsList1', './PointsList1'),
 TranslateRichText: componentLoader.add('TranslateRichText', './translateRichText'),
 TranslateQuillText: componentLoader.add('TranslateQuillText', './translateQuillText'),
 ListGoods: componentLoader.add('ListGoods', './ListGoods'),
 uploadFile: componentLoader.add('uploadFile', './uploadFile'),
 carsShow: componentLoader.add('carsShow', './carsShow')
}

exports.componentLoader = componentLoader