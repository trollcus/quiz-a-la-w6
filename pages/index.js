import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import io from 'socket.io-client'

export default function Home() {
  const [Color, setColor] = useState('#F6F6F5')
  useEffect(() => {
    console.log('should try connect')
    const socket = io({ extraHeaders: { client: true } })
    socket.emit('clientConnect', true)

    socket.on('now', data => {
      console.log('data', data)
      // setResponse(data)
    })
    socket.on('newColor', ({ color }) => {
      console.log('here is new color', color)
      setColor(color)
      // setResponse(data)
    })
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: Color }}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}
