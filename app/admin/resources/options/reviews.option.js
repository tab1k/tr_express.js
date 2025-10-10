
const { Components } = require('../../components/components.js')
const db = require("../../../models");
const sidebar = require("../navigation");

const {
  before: translateBeforeHook,
} = require('../actions/translate.hook.js');

const options = {
  
  resource: db.reviews,
  options: {
      navigation: sidebar[3],
      properties: {
        createdAt: { isVisible: { list: false } },
        updatedAt: { isVisible: { list: false } },
        goods_id: { isVisible: { list: false, show: true } },
        transport_id: { isVisible: { list: false, show: true } },
        id: {
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
        accept: {
          icon: 'Checkmark',
          isVisible: (context) => {
            const { record } = context;
            // Проверяем, что поле is_publish равно false
            return record && record.param('is_publish') === false;
          },        
          isAccessible: true,
          variant: 'success',
          component: false,
          actionType: 'record',
          handler: async (request, response, context) => {
            const { record } = context;
            if (record) {
              // Изменение статуса на 'driver'
              await record.update({ is_publish: true });
              // Получаем обновленную запись
              return {
                record: context.record?.toJSON() || {}
              };
            }
            return {
              record: record.toJSON()
            };
          },
          after: async (response, request, context) => {
            return {
              record: context.record?.toJSON() || {},
              redirectUrl: `/resources/reviews`, // Замените на ваш путь
            }
          },
          before: async (request, context) => {
            return {
              record: context.record?.toJSON() || {},
              redirectUrl: `/resources/reviews`, // Замените на ваш путь
            }
          },
        },
        new: {
          isVisible: false
        },
        edit: {
          isVisible: false
        }
      }
  }
};

module.exports = options