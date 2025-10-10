  const path = require('path');
  const fs = require('fs/promises');
  const sharp = require("sharp");

  const after = async (response, request, context) => {
    const { record } = context;
    for (const key of Object.keys(context)) {
      if ('path' in context[key]) {
        const filePath = `upload/${Date.now()}-${context[key].name}`;
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.rename(context[key].path, filePath);
        const outputFilePath = path.join(path.dirname(filePath), `${Date.now()}-${context[key].name.replace(/\.[^/.]+$/, '')}.webp`);

        await sharp(filePath)
        .webp({ quality: 90 })
        .toFile(outputFilePath)

        fs.unlink(filePath,
        (err => {
            if (err) console.log(err);
            else {
                console.log("\nDeleted file: example_file.txt");
    
                // Get the files in current directory
                // after deletion
            }
        }));

        // await fs.unlink(filePath);
        console.log('record', record);
        const relativeOutputPath ='/' + outputFilePath;
        await record.update({ [key]: relativeOutputPath })
      }
    }
    return response;
  };

  const before = async (request, context) => {
    if (request.method === 'post') {
    
      const { ...otherParams } = request.payload;
      for (const key of Object.keys(request.payload)) {
        const payloadObj = JSON.parse(JSON.stringify(request.payload[key]));
        if (payloadObj !== null && payloadObj.hasOwnProperty('path')) {
          context[key] = request.payload[key]
          
        }
      }
      return {
        ...request,
        payload: otherParams,
      };
    }
    return request;
  };

  module.exports = { after, before };