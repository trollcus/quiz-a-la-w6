import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import io from 'socket.io-client'
import tw, { styled, css } from 'twin.macro'
import useSWR from 'swr'

import Teams from '@/components/Teams'

const styleMap = {
  connected: tw`w-4 h-4 mr-4 rounded-full bg-green-400`,
  disconnected: tw`w-4 h-4 mr-4 rounded-full bg-red-400`,
  connected_large: tw`w-6 h-6 mr-4 rounded-full bg-green-400`,
  disconnected_large: tw`w-6 h-6 mr-4 rounded-full bg-red-400 animate-pulse`,
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
    { data, error } = useSWR('/getQuiz', () =>
      fetch('/getQuiz').then(response => response.json())
    ),
    startGame = () => {
      socket.emit('startGameMsg', true)
    }

  useEffect(() => {
    if (data) {
      const formatData = {
        categories: data.categories.reduce((categories, current) => {
          return [
            ...categories,
            {
              presenterText: current.presenterText,
              title: current.title,
              questions: [
                Object.keys(current)
                  .filter(key => key.includes('question'))
                  .map(q => {
                    const newQ = q.split('_')

                    return {
                      id: `question_${newQ[1]}`,
                      question: current[`question_${newQ[1]}_title`],
                      answer: current[`question_${newQ[1]}_answer`],
                      media: current[`question_${newQ[1]}_media`],
                    }
                  })
                  .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i),
              ],
            },
          ]
        }, []),
        activities: data.activities.reduce((categories, current) => {
          return [
            ...categories,
            {
              presenterText: current.presenterText,
              title: current.title,
              questions: [
                Object.keys(current)
                  .filter(key => key.includes('question'))
                  .map(q => {
                    const newQ = q.split('_')

                    return {
                      id: `question_${newQ[1]}`,
                      question: current[`question_${newQ[1]}_title`],
                      answer: current[`question_${newQ[1]}_answer`],
                      media: current[`question_${newQ[1]}_media`],
                    }
                  })
                  .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i),
              ],
            },
          ]
        }, []),
      }

      setQuiz(formatData)
    }
  }, [data])

  useEffect(() => {
    if (Quiz) socket.emit('quizDataMsg', Quiz)
  }, [Quiz])

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
      <div tw="grid grid-cols-3 m-12">
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
        </div>

        <div tw="col-span-1">
          <h1>Lagen: </h1>
          <Teams />
        </div>
      </div>
    </>
  )
}
