const express = require('express')
const http = require('http')
const socketio = require('socket.io')

const next = require('next')
const args = require('node-args')
const chalk = require('chalk')
const divider = chalk.gray('\n-----------------------------------')
const host = args.host || 'localhost'
const socketIo = require('socket.io')
const path = require('path')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const excelToJson = require('convert-excel-to-json')
const fs = require('fs')

nextApp
  .prepare()
  .then(() => {
    const app = express()
    app.use(express.static(path.join(__dirname, '../public')))
    app.use('/_next', express.static(path.join(__dirname, '../.next')))

    const server = http.createServer(app),
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

      socket.on('gameStateMsg', state => io.emit('gameState', state))

      socket.on('teamMsg', teams => io.emit('teams', teams))

      socket.on('quizDataMsg', quiz => io.emit('quizData', quiz))

      //Whenever someone disconnects this piece of code executed
      socket.on('disconnect', () => {
        if (socket.handshake.headers.presenter) connectionInfo.presenter = false
        if (socket.handshake.headers.client) connectionInfo.client = false
        io.emit('connectionInfo', { connectionInfo })
      })
    })

    app.get('/getQuiz', (req, res) => {
      const result = excelToJson({
        source: fs.readFileSync('public/quiz/asd.xlsx'),
        sheets: [
          {
            name: 'categories',
            header: {
              rows: 1,
            },
            columnToKey: {
              A: 'id',
              B: 'title',
              C: 'presenterText',
              D: 'question_1_title',
              F: 'question_1_media',
              F: 'question_1_answer',
              G: 'question_2_title',
              H: 'question_2_media',
              I: 'question_2_answer',
              J: 'question_3_title',
              K: 'question_3_media',
              L: 'question_3_answer',
              M: 'question_4_title',
              N: 'question_4_media',
              O: 'question_4_answer',
            },
          },
          {
            name: 'activities',
            header: {
              rows: 1,
            },
            columnToKey: {
              A: 'id',
              B: 'title',
              C: 'presenterText',
              D: 'question_1_title',
              F: 'question_1_media',
              F: 'question_1_answer',
              G: 'question_2_title',
              H: 'question_2_media',
              I: 'question_2_answer',
              J: 'question_3_title',
              K: 'question_3_media',
              L: 'question_3_answer',
              M: 'question_4_title',
              N: 'question_4_media',
              O: 'question_4_answer',
            },
          },
          {
            name: 'meta',
            header: {
              rows: 1,
            },
            columnToKey: {
              A: 'name',
              B: 'image',
            },
          },
          {
            name: 'teams',
            header: {
              rows: 1,
            },
          },
        ],
      })

      res.json(result)
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
