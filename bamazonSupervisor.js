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

function supervisor(){
    inquirer.prompt([
        {
            name: "bossChoice",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function(answer){
        switch(answer.bossChoice){
            case "View Product Sales by Department":
                productSales();
                break;
            case "Create New Department":
                newDepartment();
                break;
        }
    })
}

function productSales(){
    var query = "SELECT departments.department_id AS Id, departments.department_name AS Department, departments.over_head_costs AS  ";
    query += "'Over Head Costs', SUM(products.product_sales) AS Sales, SUM(products.product_sales) - SUM(departments.over_head_costs) ";
    query +="as 'Total Profit' FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY "
    query +="departments.department_name"
    connection.query(query, function(err, data){
        if (err) throw err;
        console.log("\n==================================================================================================");
        var string = JSON.stringify(data);
        var parse = JSON.parse(string);
        console.table(parse);
        console.log("\n==================================================================================================");
        supervisor();
    })
}

function newDepartment(){
    var query = "SELECT * FROM departments"
    connection.query(query, function(err, data){
        if (err) throw err;
        var string = JSON.stringify(data);
        var parse = JSON.parse(string);
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
                validate: function(value){
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function(answer){
            var values = [answer.nameOfDepartment, answer.overhead];
            connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)", values, function(err, data){
                if (err) throw err;
                console.log("\n==================================================================================================\n");
                console.log("Your new item has been added!");
                console.log("\n==================================================================================================\n");
                supervisor();
            })
        })
    })
}