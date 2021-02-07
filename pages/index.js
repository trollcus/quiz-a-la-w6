import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import io from 'socket.io-client'
import tw, { styled, css } from 'twin.macro'

import quiz from '@/utils/mock/game'

const teams = [
  {
    name: 'Lad5',
    points: 0,
    members: ['Ternekaise', 'w6', 'mäk', 'gSOn', 'chris P'],
  },
  {
    name: 'asd',
    points: 0,
    members: ['dd', 'bourbon', 'whiskey', 'sake', 'bärs'],
  },
]

const socket = io({ extraHeaders: { client: true } })

export default function Home() {
  const [GameStarted, setGameStart] = useState(false),
    [Teams, setTeams] = useState([])

  useEffect(() => {
    socket.on('teams', teams => setTeams(teams))
    socket.on('startGame', status => setGameStart(true))
  }, [])

  // console.log(quiz)

  if (!GameStarted)
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div tw="w-full h-full flex flex-col items-center justify-center">
          <div>
            <h1 tw="text-3xl mb-6">{quiz.name}</h1>
          </div>
          <div tw="flex">
            {Teams.map(team => (
              <div key={team.name} tw="mx-8 text-center">
                <h1 tw="text-xl">{team.name}</h1>
                <div tw="flex flex-col">
                  {team.members.map(member => (
                    <p key={member}>{member}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )

  if (GameStarted)
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <Head>
          <title>Starta spelet</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div tw="w-full h-full flex flex-col items-center justify-center">
          <div>
            <h1 tw="text-3xl mb-6">Starta spelet</h1>
          </div>
        </div>
      </div>
    )
}
