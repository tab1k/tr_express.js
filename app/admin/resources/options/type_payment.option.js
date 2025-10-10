
const { Components } = require('../../components/components.js')
const db = require("../../../models");
const sidebar = require("../navigation");

const {
  before: translateBeforeHook,
} = require('../actions/translate.hook.js');

const options = {
  
  resource: db.type_payment,
  options: {
      navigation: sidebar[1],
      properties: {
        createdAt: { isVisible: { list: false } },
        updatedAt: { isVisible: { list: false } },
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
          before: async (request, context) => {
            return translateBeforeHook(request, context);
          },
        },
        edit: {
          before: async (request, context) => {
            return translateBeforeHook(request, context);
          },
        },
      },
  }
};

module.exports = options