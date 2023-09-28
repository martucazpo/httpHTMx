let db = require("./db.js")
const matchRoute = require("./matchRoute.js")
const getBody = require("./getBody.js")

module.exports = (req, res)=>{
    if (req.method === 'GET' && req.url === '/getdata') {
        let taskStr = ""
        let tasks = db.map(todo => {
            return (
                `<li>
                <div>
                    <h3>${todo.task}</h3>
                </div>
                <div>
                    <button hx-delete="/todos/${todo.id}/delete">DELETE</button>
                    <button hx-get="/todos/${todo.id}/editform">EDIT</button>
                </div>
            </li>`
            )
        })
        tasks.forEach(task => taskStr += task)
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(taskStr)
    }

    if (req.method === 'DELETE' && req.url.endsWith("delete") && matchRoute(req, req.url, '/todos/:id/delete')) {
        db = db.filter(item => item.id !== req.params.id)
        let taskStr = ""
        let tasks = db.map(todo => {
            return (
                `<li>
               <div>
                   <h3>${todo.task}</h3>
               </div>
               <div>
                   <button hx-delete="/todos/${todo.id}/delete">DELETE</button>
                   <button hx-get="/todos/${todo.id}/editform">EDIT</button>
               </div>
           </li>`
            )
        })
        tasks.forEach(task => taskStr += task)
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(taskStr)
    }

    if (req.method === 'GET' && req.url.endsWith("editform") && matchRoute(req, req.url, '/todos/:id/editform')) {
        let taskStr = ""
        let tasks = db.map(todo => {
            if (todo.id === req.params.id) {
                return (
                    `<li>
                        <form hx-put="/todos/${todo.id}/edit">
                            <label for="task" >Task to Change: </label>
                            <input name="task" id="task" value="${todo.task}" required/>
                            <button type="submit">CHANGE</button>
                        </form>
                    </li>`
                )
            } else {
                return (
                    `<li>
                    <div>
                        <h3>${todo.task}</h3>
                    </div>
                    <div>
                        <button hx-delete="/todos/${todo.id}/delete">DELETE</button>
                        <button hx-get="/todos/${todo.id}/editform">EDIT</button>
                    </div>
                </li>`
                )
            }
        })
        tasks.forEach(task => taskStr += task)
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(taskStr)
    }

    if (req.method === 'PUT' && req.url.endsWith("edit")) {
        matchRoute(req, req.url, '/todos/:id/edit')
        req.on('data', function (data) {
            getBody(req, data)
        })
        req.on('end', function () {
            db = db.map(todo => {
                if (todo.id === req.params.id) {
                    todo.task = req.body.task
                }
                return todo
            })
            let taskStr = ""
            let tasks = db.map(todo => {
                return (
                    `<li>
                   <div>
                       <h3>${todo.task}</h3>
                   </div>
                   <div>
                       <button hx-delete="/todos/${todo.id}/delete">DELETE</button>
                       <button hx-get="/todos/${todo.id}/editform">EDIT</button>
                   </div>
               </li>`
                )
            })
            tasks.forEach(task => taskStr += task)
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(taskStr)
        })
    }

    if (req.method === 'POST' && req.url.endsWith("add")) {
        req.on('data', function (data) {
            getBody(req, data)
        })
        req.on('end', function () {
            let newTask = {}
            newTask.task = req.body.task
            newTask.id = Math.ceil(Math.random() * 900000000).toString()
            db = [newTask, ...db]
            let taskStr = ""
            let tasks = db.map(todo => {
                return (
                    `<li hx-target="#list">
                   <div>
                       <h3>${todo.task}</h3>
                   </div>
                   <div>
                       <button hx-delete="/todos/${todo.id}/delete">DELETE</button>
                       <button hx-get="/todos/${todo.id}/editform">EDIT</button>
                   </div>
               </li>`
                )
            })
            tasks.forEach(task => taskStr += task)
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(taskStr)
        })
    }

}