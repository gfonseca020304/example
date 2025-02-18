import fs from 'fs'
import express from 'express'
import { engine } from 'express-handlebars'
import {fileURLToPath} from "url"
import { dirname } from "path"
import path from 'path'
import Handlebars from 'handlebars'
import { 
    initialRoute,
    loginPostRoute,
    logoutGetRoute 
} from './routes/login/login-routes.js'
import { 
    tasksGetRoute,
    newTaskGetRoute,
    addTaskPostRoute,
    editTaskGetRoute,
    updateTaskPutRoute,
    deleteTaskDeleteRoute
} from './routes/tasks/tasks-routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

app.engine('handlebars', engine({
    defaultLayout: "main",
    layoutsDir: __dirname+"/views/layouts",
    partialsDir: path.join(app.get('views'), 'partials')
}))
app.set('view engine', 'handlebars')
app.set('views', './views') // default is /views
Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});
app.use(express.static(path.join(__dirname, 'public')))

//Ensure that urlencoded info that comes from post request
app.use(express.json())
app.use(express.urlencoded({extended:true}))


//Middleware to manage the put and delete methods
function updateReqMethod(req, res, next) {
    const {method} = req.body
    if (method && method.toUpperCase() !== req.method) {
        req.method = method.toUpperCase()
    }
    next()
}

app.use(updateReqMethod)

//App endpoints

app.get('/', initialRoute)//initialRoute is a function that is imported from /route/login/login.js
app.post('/login', loginPostRoute)//loginPostRoute is a function that is imported from /route/login/login.js
app.get('/tasks/:username', tasksGetRoute)//tasksGetRoute is a function that is imported from /route/tasks/tasks.js
app.get('/newTask/:username', newTaskGetRoute)//newTaskGetRoute is a function that is imported from /route/tasks/tasks.js
app.post('/addTasks', addTaskPostRoute)//tasksAddPostRoute is a function that is imported from /route/tasks/tasks.js
app.get('/edit-task/:id/:username', editTaskGetRoute)//editTaskGetRoute is a function that is imported from /route/tasks/tasks.js
app.put('/update-task', updateTaskPutRoute)//updateTaskPutRoute is a function that is imported from /route/tasks/tasks.js
app.delete('/delete-task', deleteTaskDeleteRoute)//deleteTaskDeleteRoute is a function that is imported from /route/tasks/tasks.js
app.get('/logout', logoutGetRoute)//logoutPostRoute is a function that is imported from /route/login/login.js

//404
app.use((req, res, next) => {
    res.render('404')
})
//500
app.use((err, req, res, next) => {
    console.log(err)
    res.render('500')
})

app.listen(port, () => console.log(`Server is running on port ${port}`));