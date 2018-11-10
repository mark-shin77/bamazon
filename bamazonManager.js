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
  managerView();
});

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
                "Add New Product"
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
        }
    })
}

function viewProducts(){
    var query = "SELECT * FROM products";
    connection.query(query, function(err, data){
        if (err) throw err;
        console.log("\n==================================================================================================");
        var string = JSON.stringify(data);
        var parse = JSON.parse(string);
        for (var x = 0; x < parse.length; x++){
            console.log("Item ID: " + parse[x].item_id);
            console.log("Product Name: " + parse[x].product_name);
            console.log("Price: $" + parse[x].price);
            console.log("Quantity: " + parse[x].stock_quantity);
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        }
        console.log("==================================================================================================\n");
        managerView();
    })
}

function lowInventory(){
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function(err, data){
        if(err) throw err;
        console.log("\n==================================================================================================\n");
        console.log("These items are low in inventory! Look to restock soon!")
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        var string = JSON.stringify(data);
        var parse = JSON.parse(string);
        for (var x = 0; x < parse.length; x++){
            console.log("Item ID: " + parse[x].item_id);
            console.log("Product Name: " + parse[x].product_name);
            console.log("In Stock: " + parse[x].stock_quantity);
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        }
        console.log("\n==================================================================================================\n");
        managerView();
    });
};

function addToInventory(){
    var query = "SELECT * FROM products";
    connection.query(query, function(err, data){
        if(err) throw err;
        var string = JSON.stringify(data);
        var parse = JSON.parse(string);
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
            var quantity = parse[answer.restock - 1].stock_quantity
            var selectedId = answer.restock;
            var amount = answer.restockAmount;
            connection.query(
                    "UPDATE products SET ? WHERE ?",
                [
                    {
                    stock_quantity: parseInt(quantity) + parseInt(amount)
                    },
                    {
                    item_id: selectedId
                    }
                ],
                function(error) {
                    var new_stock = parseInt(quantity) + parseInt(amount);
                    if (error) throw err;
                    console.log("\n==================================================================================================\n");
                    console.log("The select item has been restocked!");
                    console.log("There is currently " + new_stock + " of " + parse[answer.restock - 1].product_name + " in stock!");
                    console.log("\n==================================================================================================\n");
                    managerView();
                }
            )
        })
    })
}
function newProduct(){
    var query = "SELECT * FROM products"
    connection.query(query, function(err, data){
        if (err) throw err;
        var string = JSON.stringify(data);
        var parse = JSON.parse(string);
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
                message: "How much is the product?"
            },
            {
                name: "howMany",
                input: "input",
                message: "How much stock do we have of the product?"
            },
        ]).then(function(answer){
            var values = [answer.nameOfProduct, answer.nameOfDepartment, answer.price, answer.howMany]
            connection.query(
                "INSERT INTO products (product_name, department_name, price, stock_quantity) values (?, ?, ?, ?)", values,
                function(err){
                    if (err) throw err;
                    console.log("\n==================================================================================================\n");
                    console.log("Your new item has been added!");
                    console.log("\n==================================================================================================\n");
                    managerView();
                }
            )
        })
    })
}