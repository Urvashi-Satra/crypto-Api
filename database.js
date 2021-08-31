var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'localhost', // Replace with your host name
  user: 'root',      // Replace with your database username
  password: '',      // Replace with your database password
  database: 'cryptoboarddb' // // Replace with your database Name
}); 

module.exports = conn;

//wait app.js run pe it should go on index file jo nahi hai and it will come in routes 
//this data on console is of db barabar wohi i was thinking 
//and index.js file hai vo coinmarket site ka data vala code hai