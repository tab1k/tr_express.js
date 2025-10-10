
const { Components } = require('../../components/components.js')
const db = require("../../../models");
const sidebar = require("../navigation");

const customBefore = (request, context) => {
  const { query = {} } = request
  const newQuery = {
    ...query,
    ['filters.status']: ['moderate'],
    sortBy: 'id',
    direction: 'desc'
  }
  
  request.query = newQuery
  
  return request
}

const options = {
  resource: db.users,
  options: {
      id: 'moderates',
      navigation: sidebar[0],
      properties: {
          createdAt: { isVisible: { list: false } },
          updatedAt: { isVisible: { list: false } },
          image: { 
            components: {
              show: Components.ImageShow,
            },
            isVisible: { 
              list: false,
              edit: false,
              show: true
            } 
          },
          birthday: { isVisible: { list: false } },
          country_id: { isVisible: { list: false } },
          city_id: { isVisible: { list: false } },
          email_verified_at: { isVisible: { list: false } },
          deleted_at: { isVisible: { list: false } },
          driver_verified_at: { isVisible: { list: false } },
          phone: { isVisible: { list: false } },
          google_id: { isVisible: { list: false } },
          password: { isVisible: { list: false } },
          id_card: {
            components: {
              list: Components.FileList,
              show: Components.FileShow,
            },
          },
          driver_license: {
            components: {
              list: Components.FileList,
              show: Components.FileShow,
            },
          }
      },
      actions: {
        accept: {
          icon: 'Checkmark',
          isVisible: true,
          isAccessible: true,
          variant: 'success',
          component: false,
          actionType: 'record',
          handler: async (request, response, context) => {
            const { record } = context;
            if (record) {
              // Изменение статуса на 'driver'
              await record.update({ status: 'driver', driver_verified_at: new Date() });
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
              redirectUrl: `/resources/drivers`, // Замените на ваш путь
            }
          },
          before: async (request, context) => {
            return {
              record: context.record?.toJSON() || {},
              redirectUrl: `/resources/drivers`, // Замените на ваш путь
            }
          },
        },
        reject: {
          icon: 'Close',
          isVisible: true,
          isAccessible: true,
          component: false,
          variant: 'danger',
          actionType: 'record',
          handler: async (request, response, context) => {
            const { record } = context;
            if (record) {
              // Изменение статуса на 'client'
              await record.update({ status: 'client' });
              // Получаем обновленную запись
              return {
                record: context.record?.toJSON() || {}, // Возвращаем обновленную запись
                redirectUrl: '/resources/users' // Перенаправление
              };
            }
            return {
              record: record.toJSON()
            };
          },
          after: async (response, request, context) => {
            return {
              record: context.record?.toJSON() || {},
              redirectUrl: `/resources/users`, // Замените на ваш путь
            }
          },
          before: async (request, context) => {
            return {
              record: context.record?.toJSON() || {},
              redirectUrl: `/resources/users`, // Замените на ваш путь
            }
          },
        },
        new: {
          isVisible: false
        },
        edit: {
          isVisible: false
        },
        delete: {
          isVisible: false
        },
        show: {
          isVisible: false
        },
        list: {
          before: [customBefore],
          showFilter: false,
        },
      }
  }
};

module.exports = options