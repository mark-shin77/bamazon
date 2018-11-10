var mysql = require("mysql");
var inquirer = require("inquirer");

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
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\n==================================================================================================");
        var string = JSON.stringify(res);
        var parse = JSON.parse(string);
        for (var x = 0; x < parse.length; x++){
            console.log("Item ID: " + parse[x].item_id);
            console.log("Product Name: " + parse[x].product_name);
            console.log("Price: $" + parse[x].price);
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        }
        console.log("==================================================================================================\n");
    });
    start();

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
            console.log(answer.numOfItems);
            if(answer.numOfItems > 200){
                console.log("Insufficient quantity!")
            }
            else{
                var quantity = parse[answer.itemId - 1].stock_quantity
                var selectedId = answer.itemId;
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                [
                    {
                    stock_quantity: quantity - answer.numOfItems
                    },
                    {
                    item_id: selectedId
                    }
                ],
                function(error) {
                    if (error) throw err;
                    console.log("Your total comes to: $" + parse[answer.itemId - 1].price)
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
