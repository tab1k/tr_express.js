const path = require("path");
const fs = require("fs");
const db = require("../../../models");

const before = async (request, context) => {
  if (request.method === "post") {
    let texts = {};
    let sectionId, characteristicId, parentId, pageId, countryId;
    for (const param of request.rawHeaders) {
      if (param.includes('actions/new?')) {
        const urlObj = new URL(param);
        countryId = urlObj.searchParams.get('country_id');
      }
      if (param.includes('/edit?')) {
        const urlObj = new URL(param);
        countryId = urlObj.searchParams.get('country_id');
      }
    }
    for (const key of Object.keys(request.payload)) {
      if (key.includes("objlang")) {
        let pole = key.replace("objlang", "");
        try {
          const parsedPayload = JSON.parse(request.payload[key]);
          let indexText;
          if (
            request.payload.hasOwnProperty(pole) &&
            parseInt(JSON.parse(request.payload[pole])) > 0
          ) {
            indexText = await db.translates.update(parsedPayload, {
              where: { id: parseInt(JSON.parse(request.payload[pole])) },
            });
          } else {
            indexText = await db.translates.create(parsedPayload);
          }
          texts[pole] = indexText?.dataValues?.id;
        } catch (err) {
          console.error(err);
        }
      } else if (typeof request.payload[key] === "string" || typeof request.payload[key] === "boolean") {
        texts[key] = request.payload[key];
      }
    }
    if (countryId) {
      texts['country_id'] = countryId
    }
    return {
      ...request,
      payload: texts,
    };
  }
  return request;
};

module.exports = { before };