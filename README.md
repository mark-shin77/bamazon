# BAMAZON

Bamazon is a command line app that allows users to enter as either a customer, manager, or supervisor.  Each role has different interactions with the MySQL database that holds the information.

### Short Video Presentation
- Customer Section : 
<hr>
[![Alt text](https://drive.google.com/file/d/1XLtp1Up3rGe-44nUqd21MfEyhw2ukfg7/view)](https://drive.google.com/file/d/1XLtp1Up3rGe-44nUqd21MfEyhw2ukfg7/view)

- Manager Section : https://drive.google.com/file/d/1nZdbk8Bq6xzmPqmSV8lDs61zwkWiMO4m/view
- Supervisor Section : https://drive.google.com/file/d/1030sSR6eQ9dmN6H0vvc8GldXp-wVf6DV/view

### Technologies Used
- Node
- MySQL
- Javascript

### Customer
Customers have the ability to select the item they would like to purchase by entering the ID and selecting the amount they would like to buy. The table updates the new quantity and product sales in MySQL.

### Manager
Managers have the ability to view products for sale, view low inventory, add to inventory, and add new product. The view products for sale is a get request from the MySQL database. The low inventory is a get request with a filter of stock quantity. The add to inventory is a put request that updates stock quantity. The add new product is a post request that adds a new movie to the selection.

### Supervisor
Supervisors can choose between two actions: View Product Sales by Department and Create New Department.  The View Product Sales by Department is a join table that records the total profit information.  The Create New Department is a post request that adds a department option for future products.
