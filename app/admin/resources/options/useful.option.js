
const { Components } = require('../../components/components.js')
const db = require("../../../models");
const sidebar = require("../navigation");

const {
  before: translateBeforeHook,
} = require('../actions/translate.hook.js');

const options = {
  
  resource: db.useful,
  options: {
      navigation: sidebar[2],
      properties: {
        createdAt: { isVisible: { list: false } },
        updatedAt: { isVisible: { list: false } },
        id: {
          isTitle: true
        },
        title: {
          isVisible: {
            list: true,
            edit: false,
            show: true
          }
        },
        slug: {
          components: {
            edit: Components.SlugText,
          },
          isVisible: {
            list: false,
            edit: true,
            show: true
          }
        },
        content: {
          components: {
            edit: Components.TranslateQuillText,
          },
          isVisible: {
            list: false,
            edit: true,
            show: true
          }
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