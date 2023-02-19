import http from 'http'
import debug from 'debug'
import app from './app'

const debugLog = debug('server:server')
const debugErrors = debug('ERROR:index')
debugLog.enabled = true
debugErrors.enabled = true

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val: string) {
  const port = parseInt(val, 10)

  if (Number.isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '4000')
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error: any) { // @CHECK this type may not be right
  if (error.syscall !== 'listen') {
    debugErrors(error.code, 'LEARNING ERRORS')
    throw error
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      debugErrors(error.code, 'LEARNING ERRORS')
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr?.port}`
  debugLog(`Listening on ${bind}`)
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
