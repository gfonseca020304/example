import fs from 'fs'

/**
 * HERE ARE ALL THE FUNCTIONS USED BY ALL ENDPOINTS FOR A PROPER BACKEND MANAGEMENT
 */

export function getTasks(username, fetchFromFile) {
    const tasks = fetchFromFile(username)
    tasks.forEach(task => {
        task.due_date = new Date(task.due_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    })
    const statuses = ['Pending', 'In Progress', 'Completed']
    return {tasks, statuses}
}

export function fetchFromFile(username) {
    const data = fs.readFileSync('./assets/tasks.json')
    const tasks = JSON.parse(data)
    return tasks.filter(task => task.user === username)
}
export function filterTasksList({title_or_description, status }, tasks) {
    title_or_description = title_or_description ? title_or_description.toLowerCase() : ''
    status = status ? status : 'All'
    if (title_or_description) {
        tasks = tasks.filter(task => task.title.toLowerCase().includes(title_or_description) || task.description.toLowerCase().includes(title_or_description))
    }
    if (status !== 'All') {
        tasks = tasks.filter(task => task.status.toLowerCase() === status.toLowerCase())
    }
    return tasks
}
export function addTask({title, description, due_date, status, priority, username}, tasks) {
    const newTasks = tasks.map((task, index) => {
        task.id = index + 1
        return task
    })
    newTasks.push({
        id: tasks.length + 1,
        title,
        description,
        due_date: new Date(due_date),
        completion_date: null,
        status,
        priority,
        user: username
    })
    return newTasks
}
export function uploadTaskToFile(tasks) {
    fs.writeFileSync('./assets/tasks.json', JSON.stringify(tasks, null, 2), 'utf8')
}
export function getTaskToEdit(tasks, id) {
    const task = tasks.find(task => task.id == id)
    task.due_date = new Date(task.due_date).toISOString().split('T')[0]
    const statuses = ['Pending', 'In Progress', 'Completed']
    const priorities = ['Low', 'Medium', 'High']
    return {task, statuses, priorities}
}
export function updateTask(tasks, {id, title, description, due_date, status, priority, checkbox}) {
    //console.log(tasks)
    tasks.forEach(task => {
        if (task.id === Number(id)) {
            task.title = title ? title : task.title
            task.description = description ? description : task.description
            task.due_date = due_date ? new Date(due_date) : task.due_date
            task.status = status ? status : task.status
            task.completion_date = task.status === 'Completed' ? new Date().toISOString().split('T')[0] : null 
            task.priority = priority ? priority : task.priority
        }
    })
}
export function deleteTask(tasks, id) {
    return tasks.filter(task => task.id !== Number(id))
}