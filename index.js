const inquirer = require(`inquirer`)
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test'
});

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