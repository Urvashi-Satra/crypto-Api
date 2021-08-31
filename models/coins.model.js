const sql = require("./database.js");

const Coins = function(coins) {
    this.rank = coins.rank;
    this.name = coins.name;
    this.price = coins.price;
    this.marketCap = coins.marketCap;
    this.volume = coins.volume;
    this.circulatingSupply = coins.circulatingSupply;
};

Coins.create = (newCoins, result) => {
    sql.query("INSERT INTO data SET ?", newCoins, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      console.log("created coins: ", { id: res.insertId, ...newCoins });
      result(null, { id: res.insertId, ...newCoins });
    });
  };