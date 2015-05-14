var Express = require("express"),
    BodyParser = require("body-parser"),
    Http = require("http"),
    Path = require("path"),
    app = Express();

app.set("port", 3000);

Http.createServer(app).listen(app.get("port"), function() {
    console.log("Express server listening on port " + app.get("port"));
});

app.use(Express.static(Path.join(__dirname, "")));
app.use(BodyParser.urlencoded({extended: false}));

var DataProvider = require("webix-data"),
    SchedulerMongo = DataProvider(require("webix-mongo"), require("webix-connector"));

SchedulerMongo.db("mongodb://localhost:27017/scheduler");
app.all("/data", SchedulerMongo.crud("tasks", function(state, resolve) {
    resolve(null, true);
}));

module.exports = app;
