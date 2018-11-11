// Require dependencies
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
    // Selecting the Columns I want from products table
    connection.query("SELECT item_id, product_name, price FROM products", function(err, data) {
        if (err) throw err;
        console.log("\n==================================================================================================\n");
        // turning data from SQL table into a string
        var string = JSON.stringify(data);
        // parsing through string
        var parse = JSON.parse(string);
        // using console.table npm to display SQL table as a table in console
        console.table(parse);
        console.log("==================================================================================================\n");
        start();
    });
}

function start(){
    // Selecting all from products table
    var query = "SELECT * FROM products";
    // Connecting to SQL to receive data
    connection.query(query, function(err, data) {
        inquirer.prompt([
            {
                name: "itemId",
                input: "input",
                message: "What is the item ID of the item you wish you purchase?",
                // Checks whether or not user input is a number
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
                // Checks whether or not user input is a number
                validate: function(value){
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function(answer){
            // turning data from SQL table into a string
            var string = JSON.stringify(data);
            // parsing through string
            var parse = JSON.parse(string);
            // Amount of stock there is of an item, using -1 so that item id = array location
            var quantity = parse[answer.itemId - 1].stock_quantity
            // Checking if product is sold out
            if(quantity == 0){
                console.log("\n==================================================================================================\n");
                console.log("We're currently sold out of this item, Please check back later!")
                console.log("\n==================================================================================================\n");
            }
            // Checking if there is enough stock of item user desires
            else if(answer.numOfItems > quantity){
                console.log("\n==================================================================================================\n");
                console.log("Insufficient quantity!")
                console.log("We're very sorry, we currently do not have the amount selected in stock.")
                console.log("\n==================================================================================================\n");
            }
            // Selling desired amount of products to user
            else{
                // Total amount of sales, using -1 so that item id = array location
                var product_sales_total = parse[answer.itemId - 1].product_sales
                // Item user selected
                var selectedId = answer.itemId;
                // Connecting to SQL to receive data
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                [
                    {
                    // updating stock_quantity in products table
                    stock_quantity: quantity - answer.numOfItems,
                    // updating product_sales in products table
                    product_sales: (parse[answer.itemId - 1].price * answer.numOfItems) + product_sales_total
                    },
                    {
                    // updating at user selected item id
                    item_id: selectedId
                    }
                ],
                function(error) {
                    if (error) throw err;
                    // Total amount of order displayed to user, using -1 so that item id = array location
                    console.log("Your total comes to: $" + (parse[answer.itemId - 1].price * answer.numOfItems));
                    console.log("You have successfully placed your order!")
                    console.log("Please allow a few moments for the order to process.")
                    console.log("The item will be shipped in 1-3 business days.")    
                }
                );
            }
            // Ending connection
            connection.end();
        })
    })
};
