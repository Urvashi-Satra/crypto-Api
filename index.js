const http = require('http');
const fs = require('fs');
const axios= require('axios');
const cheerio = require('cheerio');
const express=require('express');
const app=express();

var mysql = require('mysql');

// Configure MySQL connection
var connection = mysql.createConnection({
	host: 'localhost', // Replace with your host name
    user: 'root',      // Replace with your database username
    password: '',      // Replace with your database password
    database: 'cryptoboarddb' // // Replace with your database Name
})

//Establish MySQL connection
connection.connect(function(err) {
   if (err) 
      throw err
   else {
       console.log('Connected to MySQL INDEX.js');
 }
});

async function getPriceFeed(){
  
    try {
        const siteUrl='https://coinmarketcap.com/'
        
        const { data }=await axios({
            method:"GET",
            
            url:siteUrl,
        })
        const $=cheerio.load(data);
        //const elemSelector='#__next > div > div.main-content > div.sc-57oli2-0.dEqHl.cmc-body-wrapper > div > div > div.tableWrapper___3utdq.cmc-table-homepage-wrapper___22rL4 > table > tbody > tr';
       const elemSelector='#__next > div.bywovg-1.sXmSU > div.main-content > div.sc-57oli2-0.dEqHl.cmc-body-wrapper > div > div:nth-child(1) > div.h7vnx2-1.bFzXgL > table > tbody > tr';
       
       const keys=[
            'rank',
            'name',
            'price',
            '24h',
            '7d',
            'marketCap',
            'volume',
            'circulatingSupply'
       ]
       const coinArr=[]
      $(elemSelector).each((parentIdx,parentElem)=>{
            let keyIdx=0
            const coinObj={}
            if(parentIdx <= 9)
            { 
                $(parentElem).children().each((childIdx,childElem)=>{
                    let tdValue=$(childElem).text();
                    if(keyIdx === 1 || keyIdx === 6 ){
                        tdValue= $('p:first-child',$(childElem).html()).text()
                            
                    }

                    if(tdValue){
                       
                        coinObj[keys[keyIdx]]=tdValue;

                        keyIdx++;
                    }
                })
                coinArr.push(coinObj); 
                
            }
        })
        return coinArr
        
    } catch (err) {
        console.error(err)
    }
};

getPriceFeed();

app.get('/api/price-feed',async(req,res)=>{
    try {
        const priceFeed=await getPriceFeed();
        var values = [];
        var dataResponse = JSON.stringify(priceFeed);
        
        var parseData = JSON.parse(dataResponse);
        console.log(parseData);
        for(var i=0; i< parseData.length; i++)
            values.push([parseData[i].rank, parseData[i].name, parseData[i].price, parseData[i].marketCap, parseData[i].volume, parseData[i].circulatingSupply, "1"]);

            connection.query('UPDATE data SET status = 0 WHERE 1', function(err,result) {
                if(err) {
                    // res.send('Error');
                }
                else {
                    // res.send('Success');
                }
            });

            //Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
            connection.query('INSERT INTO data (rank, name, price, marketcap, volume, circulatingsupply, status) VALUES ?', [values], function(err,result) {
            if(err) {
                // res.send('Error');
            }
            else {
                // res.send('Success');
            }
            });
        
            return res.status(200).json({
                coinsDetails :priceFeed,
            });
    } 
    catch (err) {
        return res.status(500).json({
        err: err.toString(),
        })
    }
})

   
app.listen(8000,()=>{
    console.log("running on port 8000")
})
