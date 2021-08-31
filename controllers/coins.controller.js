const Coins = require("../models/coins.model.js");

// Create and Save a new Coins
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a Coins
    const coins = new Coins({
      rank: req.body.rank,
      name: req.body.name,
      price: req.body.price,
      marketcap: req.body.marketcap,
      volume : req.body.volume,
      circulatingsupply : req.body.circulatingSupply
    });
  
    // Save Customer in the database
    Coins.create(coins, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Customer."
        });
      else res.send(data);
    });
  };