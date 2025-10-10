
const { Components } = require('../../components/components.js')
const db = require("../../../models");
const sidebar = require("../navigation");

const customBefore = (request, context) => {
  const { query = {} } = request
  const newQuery = {
    ...query,
    ['filters.status']: ['driver'],
    sortBy: 'id',
    direction: 'desc'
  }
  
  request.query = newQuery
  
  return request
}

const options = {
  resource: db.users,
  options: {
      id: 'drivers',
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
          email_verified_at: { isVisible: { list: false, show: true } },
          deleted_at: { isVisible: { list: false } },
          driver_verified_at: { isVisible: { list: false, show: true } },
          phone: { isVisible: { list: false, show: true } },
          google_id: { isVisible: { list: false } },
          password: { isVisible: { list: false } },
          id_card: {
            isVisible: { list: false, show: true },
            components: {
              show: Components.FileShow,
            },
          },
          driver_license: {
            isVisible: { list: false, show: true },
            components: {
              show: Components.FileShow,
            },
          }
      },
      actions: {
        new: {
          isVisible: false
        },
        edit: {
          isVisible: false
        },
        list: {
          before: [customBefore]
        },
      }
  }
};

module.exports = options