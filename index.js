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
//question array for main menu inquirer prompt
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
// question array for add department inquirer prompt
const addDeptPrompt = [
  {
    message: `What is the Department name: `,
    type: `input`,
    name: `newDept`
  }
]

const viewDept = () => {
    connection.query(`SELECT * FROM department`, (err, data) => {
      err ? console.error(err) : console.table(data);
      mainMenu();
    });
  }
  
const viewRoles = () => {
    connection.query(
      `SELECT role.id, role.title, department.name 
      AS department, role.salary 
      FROM role JOIN department 
      ON role.department_id = department.id 
      ORDER BY role.id`,
      (err, data) => {
        err ? console.error(err) : console.table(data);
        mainMenu();
      }
    );
  }
  
const viewEmployees = () => {
    connection.query(
      `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name 
      AS department, role.salary, 
      IF(employee.manager_id IS NOT NULL, CONCAT(manager.first_name, ' ', manager.last_name), NULL) as manager_name 
      FROM employee JOIN role ON employee.role_id = role.id 
      JOIN department ON department.id = role.department_id 
      LEFT JOIN employee manager ON employee.manager_id = manager.id 
      ORDER BY employee.id;`,
      (err, data) => {
        err ? console.error(err) : console.table(data);
        mainMenu();
      }
    );
  }
  
const addDept = () => {
  inquirer.prompt(addDeptPrompt)
    .then((data) => { 
      console.log(`New Department created by the name: ${data.newDept}`)
      connection.query(`INSERT INTO department (name) VALUES (?)`, data.newDept)
      mainMenu()
    })
    .catch(err => console.error(err));
    
}

const addRole = () => {
    console.log(`you selected add role`)
    let deptArray = {name:[], id:[]}
    connection.query(`SELECT id, name FROM department`, (err, data) => {
      err ?
       console.error(err) :
       data.forEach( (dept) => { //iterates through ever item in array reurned from mysql query and populates name and id arrays in deptarray object
          deptArray.name.push(dept.name)
          deptArray.id.push(dept.id) } )
          
    })
    // question array for add role inquirer prompt
    const rolePrompt = [
    {
      message: "What is the name of the role you would like to add?",
      type: "input",
      name: "roleName",
    },
    {
      message: "What is the salary of the role?",
      type: "input",
      name: "roleSalary",
    },
    {
      message: "What is the department of the role?",
      type: "list",
      choices: deptArray.name,
      name: "roleDepartment",
    }
  ]

      inquirer.prompt(rolePrompt).then((data) => {
        let index = deptArray.name.indexOf(data.roleDepartment) //sql query needs id,  so index of method used to match id with corresponding dept name
        let deptName = deptArray.id[index]
        connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
        [data.roleName, data.roleSalary, deptName])
        console.log()
        mainMenu()
      })
      .catch(err => console.error(err))
    
}

const addEmployee = () => {
  let empRole = []
  let managers = [`none`
]
  connection.query(`SELECT * FROM role`, (err, roleData) => {
    err?
    console.error(err) :
    roleData.forEach((role) => {
      empRole.push(role.title)
    })
   })
  connection.query(`SELECT first_name FROM employee WHERE manager_id is NULL`, (err, data) => {
    err?
    console.error(err) :
    data.forEach((element) => {
      managers.push(element.first_name)
      
    })
  })
  //question array for add employee inquirer prompt
const employeePrompt = [
  {
    message: "Enter first name",
    type: "input",
    name: "firstName",
  },
  {
    message: "Enter last name",
    type: "input",
    name: "lastName",
  },
  {
    message: "Enter role",
    type: "list",
    choices: empRole,
    name: "employeeRole",
  },
  {
    message: "Select employee manager",
    type: "list",
    choices: managers,
    name: "employeeManager",
  }
]
inquirer.prompt(employeePrompt).then((data) => {
  console.log(data)
})
    
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
    inquirer.prompt(promptMenu).then((data) => {
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
    }).catch(err => console.error(err));
  }

mainMenu()