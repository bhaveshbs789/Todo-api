var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: 'complete deveopment',
	completed: false
}, {
	id: 2,
	description: 'Goto new home',
	completed: false
}, {
	id: 3,
	description: 'Develop automata',
	completed: true
}]

app.get('/',function (req, res) {
	res.send('Todo API Root');
})

//GET /todos
app.get('/todos', function (req, res) {
	res.json(todos);
})

//GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	var matchedTodo;
	todos.forEach(function (todo) {
		if (todoId === todo.id){
			matchedTodo = todo;
		}
	});

	if(matchedTodo){
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
	//res.send("Asking for a todo item with id : " + req.params.id);
})

app.listen(PORT, function () {
	console.log('Express listening on Port : ' + PORT);
})