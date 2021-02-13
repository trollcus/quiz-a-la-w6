import React from 'react'
import tw, { styled, css } from 'twin.macro'

const Waiting = ({ teams, quiz }) => {
  return (
    <div tw="w-full h-full flex flex-col items-center justify-center bg-blue-400">
      <div>
        <h1 tw="text-5xl mb-6">{quiz.name}</h1>
      </div>
      <div tw="flex">
        {teams.map(team => (
          <div
            key={team.name}
            tw="mx-8 text-center bg-white shadow-xl py-4 px-8 rounded"
          >
            <h1 tw="text-3xl">{team.name}</h1>
            <div tw="flex flex-col pt-2">
              {team.members.map(member => (
                <p key={member} tw="text-xl">
                  {member}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Waiting
