const worker = require("./worker.js")
var normalizedPath = require("path").join(__dirname, "handlers");

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  const handler = require("./handlers/" + file);
  const handlerName = file.split(".")[0]
  worker.start(handlerName, handler)
});
