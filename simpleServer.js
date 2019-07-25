const url = require('url')
const http = require('http')
const fs = require('fs') 
const queryString = require('querystring')
const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
  const path = url.parse(req.url).pathname
  let query;
  if (/^\/url/.test(path)) {
    const hasQuery = req.url.search(/\?/)
    if (hasQuery !== -1) {
      query = queryString.parse(req.url.slice(hasQuery + 1)) // +1 необхідно бо вбудований в ноду парсер чутлий до "?"
    }
    if (query.first && query.second) { // що таке first and second? це параменти із url?
      // тут обробка із двома параметрами?
      fs.readFile('finility-097.json', 'utf8', (error, data) => { 
        let newJSON = []
        if (error) { // що робить ця перевірка?
          res.writeHead(404)
          res.write(error.toString())
          res.end()
        } else { // а ця штука для роботи безпосередньо із даними файлу?
          data = JSON.parse(data)
          data = Object.values(data)
          let first = query.first
          let second = query.second
          if(first > second){
            second = query.first
            first = query.second
          }
          data.forEach(element => {
            if(element['id'] >= first && element['id'] <= second ){
              newJSON.push(element)
            }
          })
          res.writeHead(200, { 'Content-Type': 'application/json' }) // тут заголовки - це понятно
          res.write(JSON.stringify(newJSON, null, 2)) // а це що робить? конвертить у json?
          res.end()
        }
      })
    } else if (query.first) {
      // а тут обробка із одним параметром? усе по аналогії із попередьою частиною of if?
      fs.readFile('finility-097.json', 'utf8', (error, data) => {
        let newJSON = []
        if (error) {
          res.writeHead(404)
          res.write(error.toString())
          res.end()
        } else {
          data = JSON.parse(data)
          data = Object.values(data)
          data.forEach(element => {
            if( element['id'] <= query.first ){
              newJSON.push(element)
            }
          })
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.write(JSON.stringify(newJSON, null, 2))
          res.end()
        }
      })
    }
  } else {
    // це перевірка на наявність файлу, правильно?
    res.writeHead(404)
    res.write('sorry file note found')
    res.end()
  }
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
