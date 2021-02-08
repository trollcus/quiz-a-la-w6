import React from 'react'
import tw, { styled, css } from 'twin.macro'

const Waiting = ({ teams, quiz }) => {
  return (
    <div tw="w-full h-full flex flex-col items-center justify-center">
      <div>
        <h1 tw="text-3xl mb-6">{quiz.name}</h1>
      </div>
      <div tw="flex">
        {teams.map(team => (
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
  )
}

export default Waiting
