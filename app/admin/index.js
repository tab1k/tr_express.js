const db = require("../models");
const ru = require("./locale/ru.js");
const themes = require("./theme/theme.js");
const users = require("./resources/options/users.option")
const drivers = require("./resources/options/drivers.option")
const user_moderates = require("./resources/options/user_moderates.option")

const useful = require("./resources/options/useful.option")
const reviews = require("./resources/options/reviews.option")
const city = require("./resources/options/city.option")
const country = require("./resources/options/country.option")
const radius = require("./resources/options/radius.option")
const type_car = require("./resources/options/type_car.option")
const transport_cars = require("./resources/options/transport_cars.option")
const goods_cars = require("./resources/options/goods_cars.option")
const type_payment = require("./resources/options/type_payment.option")
const type_activity = require("./resources/options/type_activity.option")
const shipment = require("./resources/options/shipment.option")
const currency = require("./resources/options/currency.option")
const transport = require("./resources/options/transport.option")
const goods = require("./resources/options/goods.option")
const transport_points = require("./resources/options/transport_points.option")
const goods_points = require("./resources/options/goods_points.option")


const { Components, componentLoader } = require('./components/components.js')

const dashboardHandler = async (request, response, context) => {
    const datas = {} 
    datas.users_count = 0
    datas.house_count = 0
    datas.blogs_count = 0
    datas.h_count = 0
    return datas
}
module.exports = {
 resources: [
    users,
    drivers,
    user_moderates,
    transport_cars,
    goods_cars,
    goods,
    goods_points,
    transport,
    transport_points,
    reviews,
    useful,
    country,
    currency,
    shipment,
    radius,
    city,
    // type_activity,
    type_payment,
    type_car,
    {
      resource: db.translates,
      options: {
        navigation: false,
        properties: {
          createdAt: { isVisible: { list: false } },
          updatedAt: { isVisible: { list: false } },
          ru: {
            isTitle: true,
          },
        },
        delete: false,
      }
    }
 ],
 rootPath: '/',
 loginPath: '/login',
 logoutPath: '/logout',
 locale: {
  language: 'ru',
  translations: ru
 },
 branding: {
    logo: '/logo.svg',
    favicon: '/favicon.svg',
    companyName: 'Trucking Desk Admin',
    withMadeWithLove: false,
    theme: themes
 },
 assets: {
    styles: ["/custom.css", "/quill.snow.css"]
 },
 dashboard: {
    component: Components.Dashboard,
    handler: dashboardHandler
 },
 componentLoader,
}