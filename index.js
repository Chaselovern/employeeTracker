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
                "View Employees by Department",
                "View Employees by Role",
                "Update Employee Roles",
                "Exit"
            ]
        }
    )
    .then(function(response){
        //console.log(response.menu);
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
            case "View Employees by Department":
                viewEmployeesByDepartment();
                break;
            case "View Employees by Role":
                viewEmployeesByRole();
                break;   
            case "Update Employee Roles":
                updateEmployeeRoles();
                break;
            case "Exit":
                menuExit();
                break;

        }
    });
}
 
function addDepartment(){
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Enter the department name: "
        },

    ]).then(function (response){
        connection.query("INSERT INTO department SET ?",
        {
            name: response.name,
        }, function(err){
            if (err) throw err
            console.table(response)
            startMenu()
        })
    })

}
 
function addRoles(){
    var departmentArray = [];
    connection.query("SELECT * FROM department",
    function(err, res){
        for(var i=0; i<res.length; i++ ){
            departmentArray.push(res[i].name)
        }
    }
    )

    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "Enter the title for the role: "
        },
        {
            name: "salary",
            type: "number",
            message: "Enter the salary amount (decimal): "
        },
        {
            name: "department",
            type: "list",
            message: "Please select a department: ",
            choices: departmentArray
        },

    ]).then(function (response){
        connection.query("INSERT INTO role SET ?",
        {
            title: response.title,
            salary: response.salary,
            department_id: departmentArray.indexOf(response.department)+1
        }, function(err){
            if (err) throw err
            console.table(response)
            startMenu()
        })
    })
    

}

function addEmployees(){
    var roleArray = [];
    connection.query("SELECT * FROM role",
    function(err, res){
        for(var i=0; i<res.length; i++ ){
            roleArray.push(res[i].title)
        }
    }
    )

    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "Enter the employee's first name: "
        },
        {
            name: "last_name",
            type: "input",
            message: "Enter the employee's last name: "
        },
        {
            name: "role",
            type: "list",
            message: "Please select a role: ",
            choices: roleArray
        },

    ]).then(function (response){
        connection.query("INSERT INTO employee SET ?",
        {
            first_name: response.first_name,
            last_name: response.last_name,
            role_id: roleArray.indexOf(response.role)+1
        }, function(err){
            if (err) throw err
            console.table(response)
            startMenu()
        })
    })
}

function viewDepartments(){
    connection.query("SELECT * from department",
    function(err,res){
        console.table(res);
        startMenu();
    });
}
function viewRoles(){
    connection.query("SELECT * from role",
    function(err,res){
        console.table(res);
        startMenu();
    });
}
function viewEmployeesByDepartment(){    
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS department FROM employee JOIN role on employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER by employee.id;" ,
    function(err,res){
        console.table(res);
        startMenu();
    });

}

function viewEmployeesByRole(){
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS title FROM employee JOIN role on employee.role_id = role.id;",
    function(err,res){
        console.table(res);
        startMenu();
    });

}

function viewEmployees(){
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name AS Department, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    function(err,res){
        console.table(res);
        startMenu();
    });
}

function getEmployees(){
    var tempArray = [];
    connection.query("SELECT * FROM employee",
    function(err, res){
        for(var i=0; i<res.length; i++ ){
            tempArray.push(res[i].last_name)
        }
    }
    )
    return tempArray;

}

function updateEmployeeRoles(){
    
    inquirer.prompt([
        {
            name: "role",
            type: "list",
            message: "Please select an employee: ",
            choices: getEmployees()
        },

    ]);
}

function menuExit(){
    connection.end();
    return 0;
}