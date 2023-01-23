const inquirer = require(`inquirer`)
const mysql = require('mysql2');
const cTable = require(`console.table`);

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: `password`,
  database: 'employee_db'
},
console.log(`Connection to employee_db was succesful`));

const promptMenu = [
    {
      message: `What would you like to do?`,
      type: `list`,
      choices: [
        `View All Departments`,
        `View All Roles`,
        `View All Employees`,
        `Add Department`,
        `Add Role`,
        `Add Employee`,
        `Update Employee Role`,
        `Exit`,
      ],
      name: 'action'
    },
  ];

const viewDept = () => {
    connection.query(`SELECT * FROM department`, (err, data) => {
      console.table(data);
      mainMenu();
    });
  }
  
const viewRoles = () => {
    connection.query(
      `SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id ORDER BY role.id`,
      (err, data) => {
        console.table(data);
        mainMenu();
      }
    );
  }
  
const viewEmployees = () => {
    connection.query(
      `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, IF(employee.manager_id IS NOT NULL, CONCAT(manager.first_name, ' ', manager.last_name), NULL) as manager_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY employee.id;`,
      (err, data) => {
        console.table(data);
  
        mainMenu();
      }
    );
  }
  
const addDept = () => {
    console.log(`you selected add department`)
    mainMenu()
}

const addRole = () => {
    console.log(`you selected add role`)
    mainMenu()
}

const addEmployee = () => {
    console.log(`you selected add employee`)
    mainMenu()
}

const updateRole = () => {
    console.log(`you selected update employee role`)
    mainMenu()
}

const exit = () => {
    console.log(`you've exited the application, Good bye!`)
    process.exit()
}

const mainMenu = () => {
    inquirer.prompt(menuQuestions).then((data) => {
      const action = data.action;
      switch (action) {
        case `View All Departments`:
          viewDept();
          break;
        case `View All Roles`:
          viewRoles();
          break;
        case `View All Employees`:
          viewEmployees();
          break;
        case `Add Department`:
          addDept();
          break;
        case `Add Role`:
          addRole();
          break;
        case `Add Employee`:
          addEmployee();
          break;
        case `Update Employee Role`:
          updateRole();
          break;
        case `Exit`:
          exit();
          break;
      }
    });
  }

