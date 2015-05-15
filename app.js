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
    schedulerMongo = connector("mongodb://localhost:27017/scheduler", "mongo");// Init connector for mongoDB.

//Map data for db operations.
var mappedSchedulerMongo = schedulerMongo.map({text: "db_text", start_date: "db_start_date"});
app.all("/data", mappedSchedulerMongo.crud("tasks1", function(state, resolve) {

    //If action is delete, stop processing request and send custom response.
    if(state.action == "delete") {
        resolve(null, false);
        state.response.json({action: "error"});
    }
    else
        resolve(null, true);
}));

module.exports = app;
