const express = require('express')
const http = require('http')
const socketio = require('socket.io')

const next = require('next')
const args = require('node-args')
const chalk = require('chalk')
const divider = chalk.gray('\n-----------------------------------')
const host = args.host || 'localhost'
const socketIo = require('socket.io')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

nextApp
  .prepare()
  .then(() => {
    const app = express(),
      server = http.createServer(app),
      io = new socketio.Server(),
      connectionInfo = {
        presenter: false,
        client: false,
      }
    io.attach(server)

    io.on('connection', socket => {
      if (socket.handshake.headers.presenter) connectionInfo.presenter = true
      if (socket.handshake.headers.client) connectionInfo.client = true
      io.emit('connectionInfo', { connectionInfo })

      socket.on('clickFunction', msg => {
        io.emit('newColor', { color: msg })
      })

      //Whenever someone disconnects this piece of code executed
      socket.on('disconnect', () => {
        if (socket.handshake.headers.presenter) connectionInfo.presenter = false
        if (socket.handshake.headers.client) connectionInfo.client = false
        io.emit('connectionInfo', { connectionInfo })
      })
    })

    app.all('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, err => {
      if (err) throw err
      console.log(`
${chalk.bgBlue.black(' W6 ')}${chalk.bgYellow.black(' QUIZ ')}
${chalk.bgGreen.black(' DONE ')} Server started
${divider}

${chalk.bgBlue.black(' URL -> ')} Localhost: ${chalk.magenta(
        `http://${host}:${port}`
      )}
${chalk.bgWhite.black(' API -> ')} ${chalk.cyan(
        `${process.env.NEXT_PUBLIC_API_URL}`
      )}
${chalk.bgGray.black(' To stop -> ')} ${chalk.gray(
        `Press ${chalk.italic('CTRL-C')} to stop`
      )}
    `)
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })
