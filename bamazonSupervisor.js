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
  supervisor();
});

// initial function to choose what user wants to do 
function supervisor(){
    // Asking user what they want to do  
    inquirer.prompt([
        {
            name: "bossChoice",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department", "Exit"]
        }
    ]).then(function(answer){
        switch(answer.bossChoice){
            case "View Product Sales by Department":
                productSales();
                break;
            case "Create New Department":
                newDepartment();
                break;
            case "Exit":
                connection.end();
                break;
        };
    });
};

function productSales(){
    // Selecting what I want from each table and using a left join to combine them
    var query = "SELECT departments.department_id AS Id, departments.department_name AS Department, departments.over_head_costs AS  ";
    query += "'Over Head Costs', SUM(products.product_sales) AS Sales, SUM(products.product_sales) - SUM(departments.over_head_costs) ";
    query +="as 'Total Profit' FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY "
    query +="departments.department_name"
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
        console.log("\n==================================================================================================");
        // reloading initial function for user to choose what to do next
        supervisor();
    });
};

function newDepartment(){
    // Select all from departments
    var query = "SELECT * FROM departments"
    // Connecting to SQL to receive data
    connection.query(query, function(err, data){
        if (err) throw err;
        // Asking user what they want to do  
        inquirer.prompt([
            {
                name: "nameOfDepartment",
                input: "input",
                message: "What is the name of the department you wish to add?"
            },
            {
                name: "overhead",
                input: "input",
                message: "What are the over head costs of the new department?",
                // Checks whether or not user input is a number
                validate: function(value){
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function(answer){
            // Adding a new department / over head cost to the Departments Table
            var values = [answer.nameOfDepartment, answer.overhead];
            connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)", values, function(err, data){
                if (err) throw err;
                console.log("\n==================================================================================================\n");
                console.log("Your new item has been added!\n");
            })
            // Displaying the newly updated Departments Table to user
            connection.query("SELECT department_id AS Id, department_name AS Department, over_head_costs AS 'Over Head Costs' FROM departments", 
            function(err, data){
                if (err) throw err;
                // turning data from SQL table into a string
                var string = JSON.stringify(data);
                // parsing through string
                var parse = JSON.parse(string);
                // using console.table npm to display SQL table as a table in console
                console.table(parse);
                console.log("==================================================================================================");
                supervisor();
            });        
        });
    });
};