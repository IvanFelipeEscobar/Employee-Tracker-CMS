INSERT INTO department (name)
VALUES
    ("Tech"),
    ("Customer Service"),
    ("Human Resources");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("Developer", 70000, 1), 
    ("Sales Associate", 12000, 2), 
    ("HR Rep", 55000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("Walter", "White", 3, 3),
    ("Jesse", "Pinkman", 2, 3),
    ("Mike", "Ehrmantraut", 1, NULL);