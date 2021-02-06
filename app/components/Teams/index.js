import React, { useState } from 'react'
import tw, { styled, css } from 'twin.macro'

const Teams = () => {
  const [Teams, setTeams] = useState([
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
  ])
  return (
    <div>
      {Teams?.map(({ name, members, points }, idx) => (
        <div tw="p-3 bg-gray-200 rounded my-6 rounded" key={name.toLowerCase()}>
          <h1 tw="font-bold text-lg">Namn: {name}</h1>
          <h3>Utmanarna</h3>
          {members.map(member => (
            <p>{member}</p>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Teams
