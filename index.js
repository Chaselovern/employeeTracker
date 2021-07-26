var mysql      = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require ("console.table");
const { allowedNodeEnvironmentFlags } = require("process");



var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_tracker"
});
 
connection.connect(function(err) {
    if (err) throw err;

    console.log("Connection Established");

    startMenu();
}
);

function startMenu(){
    inquirer
    .prompt(
        {
            name: "menu",
            type: "list",
            message: "Please choose one of the following: ",
            choices:[
                "Add Department",
                "Add Roles",
                "Add Employees",
                "View Departments",
                "View Roles",
                "View Employees",
                "Update Employee Roles"
            ]
        }
    )
    .then(function(response){
        console.log(response.menu);
        switch(response.menu){
            case "Add Department":
                addDepartment();
                break;
            case "Add Roles":
                addRoles();
                break;
            case "Add Employees":
                addEmployees();
                break;
            case "View Departments":
                viewDepartments();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "View Employees":
                viewEmployees();
                break;
            case "Update Employee Roles":
                updateEmployeeRoles();
                break;

        }
    });
}
 
function addDepartment(){

}
 
function addRoles(){

}

function addEmployees(){

}

function viewDepartments(){
    console.log("ViewDepartments");
    connection.query("SELECT employee.first_name, employee.last_name. department.name AS Department FROM employee JOIN role on employee.role_id = role.id JOIN department ON role.department_id - department.id ORDER by employee.id;" ,
    function(res){
        console.table(res);
        console.log("ViewDepartments2");
        startMenu();
    });

}

function viewRoles(){
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS title FROM employee JOIN role on employee.role_id = role.id;",
    function(res){
        console.table(res);
        startMenu();
    });

}

function viewEmployees(){

}

function updateEmployeeRoles(){
    
}
connection.end();