var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/',function (req, res) {
	res.send('Todo API Root');
})

//GET /todos
app.get('/todos', function (req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;

	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed : true})
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed: false})
	}

	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function (todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		})
	}

	res.json(filteredTodos);
})

//GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	//the underscore method above does the same as the below commented code ie 5 lines
	// todos.forEach(function (todo) {
	// 	if (todoId === todo.id){
	// 		matchedTodo = todo;
	// 	}
	// });

	if(matchedTodo){
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
	//res.send("Asking for a todo item with id : " + req.params.id);
})

app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	body.description = body.description.trim();

	body.id = todoNextId;
	todoNextId++;

	todos.push(body);
	//console.log('Description : ' + body.description);
	res.json(body);
});

app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(!matchedTodo) {
		res.status(404).json({"error": "no todo item found with the id"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo)
	}
})

app.put('/todos/:id', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(!matchedTodo) {
		return res.status(404).send();
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}
	// if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().lenghth === 0) {
	// 	return res.status(400).send();
	// }
	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);


})

app.listen(PORT, function () {
	console.log('Express listening on Port : ' + PORT);
})