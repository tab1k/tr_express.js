
const { Components } = require('../../components/components.js')
const db = require("../../../models");
const sidebar = require("../navigation");

const {
  before: translateBeforeHook,
} = require('../actions/translate.hook.js');

const options = {
  
  resource: db.transport,
  options: {
      navigation: sidebar[3],
      properties: {
        createdAt: { isVisible: { list: false, show: true } },
        deletedAt: { isVisible: { list: false, show: false, edit: false } },
        updatedAt: { isVisible: { list: false } },
        id: {
          isTitle: true
        },
        carsShow: {
          order: 11,
          components: {
            show: Components.carsShow
          },
          isVisible: {
            list: false,
            edit: false,
            show: true
          }
        },
        points_list: {
          order: 10,
          components: {
            show: Components.PointsList1
          },
          isVisible: {
            list: false,
            edit: false,
            show: true
          }
        }
      },
      actions: {
        new: {
          isVisible: false
        },
        edit: {
          isVisible: false
        },
      }
  }
};

module.exports = options