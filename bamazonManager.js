// Require dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table")

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
  managerView();
});

// initial function to choose what user wants to do 
function managerView(){
    inquirer.prompt([
        {
            name: "managerChoice",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale", 
                "View Low Inventory", 
                "Add to Inventory", 
                "Add New Product",
                "Exit"
            ]
        }
    ]).then(function(answer){
        switch(answer.managerChoice){
            case "View Products for Sale":
                viewProducts();
                break;
                case "View Low Inventory":
                lowInventory();
                break;
                case "Add to Inventory":
                addToInventory();
                break;
                case "Add New Product":
                newProduct();
                break;
                case "Exit":
                connection.end();
                break;
        };
    });
};

function viewProducts(){
    // Selecting the 3 columns I want from Products table in SQL
    var query = "SELECT item_id AS Id, product_name AS Product, Price, stock_quantity AS Stock FROM products";
    // Connecting to SQL to receive data
    connection.query(query, function(err, data){
        if (err) throw err;
        console.log("\n==================================================================================================");
        // turning data from SQL table into a string
        var string = JSON.stringify(data);
        // parsing through string
        var parse = JSON.parse(string);
        // using console.table npm to display SQL table as a table in console
        console.table(parse);
        console.log("==================================================================================================\n");
        managerView();
    });
};

function lowInventory(){
    // Selecting the items that have a stock quantity less than 5
    var query = "SELECT item_id AS Id, product_name AS Product, stock_quantity AS Stock FROM products WHERE stock_quantity < 5";
    // Connecting to SQL to receive data
    connection.query(query, function(err, data){
        if(err) throw err;
        console.log("\n==================================================================================================\n");
        console.log("These items are low in inventory! Look to restock soon!")
        console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
        // turning data from SQL table into a string
        var string = JSON.stringify(data);
        // parsing through string
        var parse = JSON.parse(string);
        // using console.table npm to display SQL table as a table in console
        console.table(parse);
        console.log("\n==================================================================================================\n");
        managerView();
    });
};

function addToInventory(){
    // Selecting everything from products table
    var query = "SELECT * FROM products";
    // Connecting to SQL to receive data
    connection.query(query, function(err, data){
        if(err) throw err;
        // turning data from SQL table into a string
        var string = JSON.stringify(data);
        // parsing through string
        var parse = JSON.parse(string);
        // Asking user which item they want to restock
        inquirer.prompt([
            {
                name: "restock",
                input: "input",
                message: "Which item would you like to restock?"
            },
            {
                name: "restockAmount",
                input: "input",
                message: "How many items would you like to add?"
            },
        ]).then(function(answer){
            // getting amount of items in stock, using -1 so item id = array location 
            var quantity = parse[answer.restock - 1].stock_quantity;
            // product name, using -1 so item id = array location
            var item_name = parse[answer.restock - 1].product_name;
            // item user wishes to restock
            var selectedId = answer.restock;
            // amount user wishes to restock 
            var amount = answer.restockAmount;
            // Connecting to SQL to receive data
            connection.query(
                    "UPDATE products SET ? WHERE ?",
                [
                    {
                    // Using parseInt to change values to numbers and add them together
                    stock_quantity: parseInt(quantity) + parseInt(amount)
                    },
                    {
                    item_id: selectedId
                    }
                ],
                function(error) {
                    // current amount of items in stock
                    var new_stock = parseInt(quantity) + parseInt(amount);
                    if (error) throw err;
                    console.log("\n==================================================================================================\n");
                    console.log("The selected item has been restocked!");
                    console.log("There is currently " + new_stock + " of the '" + item_name + "' in stock!");
                    console.log("\n==================================================================================================\n");
                    managerView();
                }
            );
        });
    });
};

function newProduct(){
    // Selecting products table from SQL
    var query = "SELECT * FROM products"
    // Connecting to SQL to receive data
    connection.query(query, function(err, data){
        if (err) throw err;
        inquirer.prompt([
            {
                name: "nameOfProduct",
                input: "input",
                message: "What is the name of the product you wish to add?"
            },
            {
                name: "nameOfDepartment",
                input: "input",
                message: "Which department should the product be placed into?"
            },
            {
                name: "price",
                input: "input",
                message: "How much is the product?",
                // Checks whether or not user input is a number
                validate: function(value){
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "howMany",
                input: "input",
                message: "How much stock do we have of the product?",
                // Checks whether or not user input is a number
                validate: function(value){
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
        ]).then(function(answer){
            // Using user input as values for new information for Products table
            var values = [answer.nameOfProduct, answer.nameOfDepartment, answer.price, answer.howMany];
            // Connecting to SQL to receive data
            connection.query(
                "INSERT INTO products (product_name, department_name, price, stock_quantity) values (?, ?, ?, ?)", values,
                function(err){
                    if (err) throw err;
                    console.log("\n==================================================================================================\n");
                    console.log("Your new product has been added!\n");
                }
            )
            // Displaying the newly updated Products Table to user
            connection.query("SELECT item_id AS Id, product_name AS Product, stock_quantity AS Stock FROM products", 
            function(err, data){
                if (err) throw err;
                // turning data from SQL table into a string
                var string = JSON.stringify(data);
                // parsing through string
                var parse = JSON.parse(string);
                // using console.table npm to display SQL table as a table in console
                console.table(parse);
                console.log("==================================================================================================\n");
                managerView();
            });        
        });
    });
};