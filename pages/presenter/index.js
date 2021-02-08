import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import io from 'socket.io-client'
import tw, { styled, css } from 'twin.macro'

import useGetQuiz from '@/hooks/useGetQuiz'

import Teams from '@/components/Teams'

const styleMap = {
  connected: tw`w-4 h-4 mr-4 bg-green-400 rounded-full`,
  disconnected: tw`w-4 h-4 mr-4 bg-red-400 rounded-full`,
  connected_large: tw`w-6 h-6 mr-4 bg-green-400 rounded-full`,
  disconnected_large: tw`w-6 h-6 mr-4 bg-red-400 rounded-full animate-pulse`,
}

const getStyleName = ({ connectionType, variant }) =>
  styleMap[`${connectionType}${variant ? '_' + variant : ''}`] ||
  styleMap.disconnected

const ConnectionHint = styled.div(getStyleName)

const socket = io({ extraHeaders: { presenter: true } })

export default function Presenter() {
  const [Connected, setConnected] = useState({
      presenter: false,
      client: false,
    }),
    [Quiz, setQuiz] = useState(null),
    [QuizTeams, setTeams] = useState([]),
    [GameState, setGameState] = useState({ view: 'waiting', data: null }),
    { quiz, error } = useGetQuiz(),
    startGame = () => {
      setGameState({ view: 'categories', data: null })
    },
    syncGame = () => {
      socket.emit('quizDataMsg', Quiz)
      socket.emit('gameStateMsg', GameState)
      socket.emit('teamMsg', QuizTeams)
    }

  useEffect(() => {
    // If we recieve quiz data from server
    if (quiz) {
      const { teams, ...rest } = quiz
      setQuiz(rest)

      // Load teams from XLSX
      if (teams) setTeams(teams.map(team => ({ ...team, points: 0 })))
    }
  }, [quiz])

  useEffect(() => {
    if (Quiz) socket.emit('quizDataMsg', Quiz)
  }, [Quiz])

  useEffect(() => {
    socket.emit('teamMsg', QuizTeams)
  }, [QuizTeams])

  useEffect(() => {
    socket.emit('gameStateMsg', GameState)
  }, [GameState])

  useEffect(() => {
    socket.on('connectionInfo', ({ connectionInfo }) =>
      setConnected({ ...connectionInfo })
    )
  }, [])

  return (
    <>
      <div>
        <Head>
          <title>Moderatorvy</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </div>
      <div tw="grid grid-cols-3 m-12 gap-12">
        <div tw="col-span-1">
          <div tw="flex items-center mb-3">
            {Connected.presenter ? (
              <ConnectionHint connectionType="connected" />
            ) : (
              <ConnectionHint connectionType="disconnected" />
            )}
            <p>
              {Connected.presenter
                ? 'Ansluten till servern'
                : 'Inte ansluten än'}
            </p>
          </div>
          <div tw="flex items-center mb-3">
            {Connected.client ? (
              <ConnectionHint connectionType="connected" />
            ) : (
              <ConnectionHint connectionType="disconnected" />
            )}
            <p>
              {Connected.client
                ? 'Spelvyn är redo'
                : 'Spelvyn är inte ansluten än'}
            </p>
          </div>
          <hr tw="w-2/4 border-gray-300 my-6" />
          <div tw="flex items-center mt-3 mb-6">
            {Connected.client && Connected.presenter ? (
              <ConnectionHint connectionType="connected" variant="large" />
            ) : (
              <ConnectionHint connectionType="disconnected" variant="large" />
            )}
            <p tw="font-bold">
              {Connected.client && Connected.presenter
                ? 'Redo att köra igång'
                : 'Inväntar spelvyn'}
            </p>
          </div>
          <button
            tw="bg-blue-600 py-2 px-4 rounded text-white my-4"
            onClick={startGame}
          >
            Starta spelet
          </button>
          <button
            tw="bg-blue-600 py-2 px-4 rounded text-white my-4"
            onClick={syncGame}
          >
            Synka spelet
          </button>
          <h1>Lagen: </h1>
          <Teams teams={QuizTeams} handleTeams={data => setTeams(data)} />
        </div>

        <div tw="col-span-1">
          {Quiz?.categories.map(category => (
            <div
              tw="p-2 my-4 bg-gray-200 rounded cursor-pointer"
              key={category.title}
              onClick={() =>
                setGameState({ view: 'categories', data: category })
              }
            >
              {category.title}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
