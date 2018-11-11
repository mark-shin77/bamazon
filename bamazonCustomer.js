var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "amazonPrime",
  database: "bamazonDB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  displayProducts();
});

function displayProducts (){
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
        if (err) throw err;
        console.log("\n==================================================================================================\n");
        var string = JSON.stringify(res);
        var parse = JSON.parse(string);
        console.table(parse);
        console.log("==================================================================================================\n");
        start();
    });
}

function start(){
    connection.query("SELECT * FROM products", function(err, res) {
        var string = JSON.stringify(res);
        var parse = JSON.parse(string);
        inquirer.prompt([
            {
                name: "itemId",
                input: "input",
                message: "What is the item ID of the item you wish you purchase?",
                validate: function(value){
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "numOfItems",
                input: "input",
                message: "How many of this product would you like to purchase?",
                validate: function(value){
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function(answer){
            if(parse[answer.itemId - 1].stock_quantity == 0){
                console.log("\n==================================================================================================\n");
                console.log("We're currently sold out of this item, Please check back later!")
                console.log("\n==================================================================================================\n");
            }
            else if(answer.numOfItems > parse[answer.itemId - 1].stock_quantity){
                console.log("\n==================================================================================================\n");
                console.log("Insufficient quantity!")
                console.log("We're very sorry, we currently do not have the amount selected in stock.")
                console.log("\n==================================================================================================\n");
            }
            else{
                var quantity = parse[answer.itemId - 1].stock_quantity
                var product_sales_total = parse[answer.itemId - 1].product_sales
                var selectedId = answer.itemId;
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                [
                    {
                    stock_quantity: quantity - answer.numOfItems,
                    product_sales: (parse[answer.itemId - 1].price * answer.numOfItems) + product_sales_total
                    },
                    {
                    item_id: selectedId
                    }
                ],
                function(error) {
                    if (error) throw err;
                    console.log("Your total comes to: $" + (parse[answer.itemId - 1].price * answer.numOfItems));
                    console.log("You have successfully placed your order!")
                    console.log("Please allow a few moments for the order to process.")
                    console.log("The item will be shipped in 1-3 business days.")    
                }
                );
            }
            connection.end();
        })
    })
};
