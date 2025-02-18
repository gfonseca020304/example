import fs, { stat } from 'fs'
import {
    getTasks,
    fetchFromFile,
    filterTasksList,
    addTask,
    uploadTaskToFile,
    getTaskToEdit,
    updateTask,
    deleteTask
} from '../../models/tasks.js'

export function tasksGetRoute(req, res) { //This endpoint is in charge of getting the tasks of a given user
    let {tasks, statuses} = getTasks(req.params.username, fetchFromFile)
    tasks = req.query ? filterTasksList(req.query, tasks) : tasks
    console.log(tasks, statuses)
    res.render(`tasks`, {username: req.params.username, tasks, statuses})
}

export function newTaskGetRoute(req, res) { //This will render the New Task form
    res.render('task-form', {username: req.params.username})
}

export function addTaskPostRoute(req, res) { //This is the endpoint that will do the backend task addition
    let tasks = getTasks(req.body.username, fetchFromFile)
    tasks = addTask(req.body, tasks)
    uploadTaskToFile(tasks)
    res.redirect(`tasks/${req.body.username}`)
}

export function editTaskGetRoute(req, res) { //This endpoint will render edit task form
    const username = req.params.username
    const {tasks, statuses} = getTasks(username, fetchFromFile)
    const {task, priorities} = getTaskToEdit(tasks, req.params.id)
    res.render('task-form', {username, task, statuses, priorities})   
}


export function updateTaskPutRoute(req, res) { // This endpoint will update the task in question
    let {tasks, statuses} = getTasks(req.body.username, fetchFromFile)
    updateTask(tasks, req.body)
    tasks ? uploadTaskToFile(tasks) : null
    res.redirect(`/tasks/${req.body.username}`)
}
export function deleteTaskDeleteRoute(req, res) { //This endpoint is for deletion
    const {id} = req.body
    let {tasks} = getTasks(req.body.username, fetchFromFile)
    tasks = deleteTask(tasks, id)
    uploadTaskToFile(tasks)
    res.redirect(`/tasks/${req.body.username}`)
}