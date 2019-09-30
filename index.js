const express = require("express");
const server = express();
server.use(express.json());

const projects = [
  {
    id: "1",
    title: "Projeto de Teste",
    tasks: []
  },
  {
    id: "2",
    title: "Projeto Área 51",
    tasks: ["Save the aliens!", "Run like Uzumaki Naruto."]
  }
];

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd("Request");
});

function checkIdExists(req, res, next) {
  if (!req.body.id) {
    return res.status(400).json({ error: "Id not found on request body" });
  }

  return next();
}

function checkTitleExists(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ error: "Title not found on request body" });
  }

  return next();
}

function checkProjectInArray(req, res, next) {
  for (var i = 0; i < projects.length; i++) {
    if (projects[i].id == req.params.id) {
      req.cont = i;
      return next();
    }
  }
  return res.status(400).json({ error: "Project does not exists" });
}

server.post("/projects", checkIdExists, checkTitleExists, (req, res) => {
  const { id } = req.body;
  const { title } = req.body;
  const tasks = [];
  projects.push({ id, title, tasks });
  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put(
  "/projects/:id",
  checkProjectInArray,
  checkTitleExists,
  (req, res) => {
    const { title } = req.body;
    projects[req.cont].title = title;
    return res.json(projects);
  }
);

server.delete("/projects/:id", checkProjectInArray, (req, res) => {
  projects.splice(req.cont, 1);
  return res.send();
});

server.post(
  "/projects/:id/tasks",
  checkProjectInArray,
  checkTitleExists,
  (req, res) => {
    const { title } = req.body;
    projects[req.cont].tasks.push(title);
    return res.json(projects);
  }
);

server.listen(33333);
