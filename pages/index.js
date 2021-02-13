import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import io from 'socket.io-client'
import tw, { styled, css } from 'twin.macro'
import useSound from 'use-sound'

import Waiting from '@/layouts/Waiting'
import Categories from '@/layouts/Categories'

const socket = io({ extraHeaders: { client: true } })

export default function Home() {
  const [GameState, setGameState] = useState({ view: 'waiting', data: null }),
    [Teams, setTeams] = useState([]),
    [Quiz, setQuiz] = useState(null),
    [play, { stop }] = useSound('/music/waiting.mp3', { volume: 0.2 })

  useEffect(() => {
    socket.on('teams', teams => setTeams(teams))
    socket.on('gameState', state => setGameState(state))
    socket.on('quizData', quiz => setQuiz(quiz))
  }, [])

  useEffect(() => {
    stop()
    if (GameState.view === 'waiting') play()
  }, [GameState])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {Quiz ? (
        <>
          {GameState.view === 'waiting' ? (
            <Waiting teams={Teams} quiz={Quiz} />
          ) : GameState.view === 'categories' ? (
            <Categories
              categories={Quiz.categories}
              category={GameState.data}
            />
          ) : (
            <Waiting teams={Teams} quiz={Quiz} />
          )}
        </>
      ) : (
        <div>Loading</div>
      )}
    </div>
  )
}
