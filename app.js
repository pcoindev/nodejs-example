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

var connector = require("connector-nodejs"),// Include connector.
    SchedulerMongo = connector("mongodb://localhost:27017/scheduler", "mongo");// Init connector for mongoDB.

//Map data and init CRUD handler for "tasks" collection.
app.all("/data", SchedulerMongo.map({text: "db_text"}).crud("tasks"));

module.exports = app;
