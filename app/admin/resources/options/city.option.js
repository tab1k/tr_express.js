
const { Components } = require('../../components/components.js')
const db = require("../../../models");
const sidebar = require("../navigation");

const {
  before: translateBeforeHook,
} = require('../actions/translate.hook.js');

const options = {
  
  resource: db.city,
  options: {
      navigation: false,
      properties: {
        createdAt: { isVisible: { list: false } },
        updatedAt: { isVisible: { list: false } },
        country_id: { isVisible: { list: false, edit: false, show: false } },
        ru: {
          isTitle: true
        },
        is_publish: {
          isVisible: {
            list: false,
            edit: true,
            show: true
          }
        }
      },
      actions: {
        new: {
          after: async (response, request, context) => {
            let countryId;
            for (const param of request.rawHeaders) {
              if (param.includes('cities/actions/new')) {
                const urlObj = new URL(param);
                countryId = urlObj.searchParams.get('country_id');
              }
            }
            return {
              record: context.record?.toJSON() || {},
              redirectUrl: `/resources/countries/records/${countryId}/show`, // Замените на ваш путь
            }
          },
          before: async (request, context) => {
            return translateBeforeHook(request, context);
          },
        },
        edit: {
          after: async (response, request, context) => {
            let countryId;
            for (const param of request.rawHeaders) {
              if (param.includes('resources/cities/records')) {
                const urlObj = new URL(param);
                countryId = urlObj.searchParams.get('country_id');
              }
            }
            return {
              record: context.record?.toJSON() || {},
              redirectUrl: `/resources/countries/records/${countryId}/show`, // Замените на ваш путь
            }
          },
          before: async (request, context) => {
            return translateBeforeHook(request, context);
          },
        },
      },
  }
};

module.exports = options