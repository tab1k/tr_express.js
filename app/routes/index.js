module.exports = (app) => {
    require("./auth.routes")(app);
    require("./profile.routes")(app);
    require("./useful.routes")(app);
    require("./dicts.routes")(app);
    require("./search.routes")(app);
    require("./goods.routes")(app);
    require("./transport.routes")(app);
    require("./reviews.routes")(app);
    require("./calculation.routes")(app);
    require("./type_activity.routes")(app);
}