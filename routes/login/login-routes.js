import fs from 'fs'

export function initialRoute (req, res){
    res.render('home')
}
export function loginPostRoute(req, res) {
    const data = fs.readFileSync('./assets/users.json')
    const users = JSON.parse(data)
    const user = users.find(user => user.username === req.body.username)
    console.log(user) 
    if (user) {
        res.redirect(`/tasks/${user.username}`)
    } else if (user === undefined) {
        users.push({
            name: req.body.name,
            username: req.body.username
        })
        res.redirect(`/tasks/${req.body.username}`)
    }
}

export function logoutGetRoute(req, res) {
    res.redirect('/')
}