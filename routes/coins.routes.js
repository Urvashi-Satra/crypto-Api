module.exports = app => {
    const coins = require("./controllers/coins.controller.js");
  
    // Create a new Customer
    app.post("/coins", coins.create);

  };