import React, { useState, useEffect } from 'react'
import tw, { styled, css } from 'twin.macro'
import AutosizeInput from 'react-input-autosize'
import io from 'socket.io-client'

const socket = io()

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
    ]),
    handleChange = ({ value, id, field, idx }) => {
      console.log('here')
      const teams = [...Teams]
      teams[idx][id] = value
      setTeams(teams)
    },
    handleMember = ({ value, teamsIndex, memberIdx }) => {
      const teams = [...Teams]
      teams[teamsIndex].members[memberIdx] = value
      setTeams(teams)
    },
    addTeam = () => setTeams([...Teams, { name: '', points: 0, members: [] }]),
    addMember = idx => {
      const teams = Teams
      teams[idx].members = [...teams[idx].members, '']
      setTeams([...teams])
    }

  useEffect(() => {
    socket.emit('teamMsg', Teams)
  }, [Teams])

  return (
    <>
      <button tw="rounded bg-blue-400 p-2" onClick={addTeam}>
        Lägg till lag
      </button>
      {Teams?.map(({ name, members, points }, idx) => (
        <div tw="p-3 bg-gray-200 rounded my-6 rounded" key={idx}>
          <h1 tw="font-bold text-lg">
            <AutosizeInput
              name="name"
              id={`${idx}-name`}
              value={name}
              placeholder="Lagnamn"
              inputStyle={{
                fontSize: 18,
                backgroundColor: '#E5E7EB',
                padding: '0.4em 0em',
              }}
              onChange={({ target: { value } }) =>
                handleChange({ value, id: 'name', idx })
              }
            />
          </h1>
          <h3 tw="mt-2 font-bold">Utmanarna: </h3>
          {members.map((member, memberIdx) => (
            <div key={`${idx}-member-${memberIdx}`}>
              <AutosizeInput
                name="member"
                id={`${idx}-id-${memberIdx}`}
                value={member}
                placeholder="Deltagarens namn"
                inputStyle={{
                  fontSize: 12,
                  backgroundColor: '#E5E7EB',
                  padding: '0.4em 0.2em',
                }}
                onChange={({ target: { value } }) =>
                  handleMember({ value, teamsIndex: idx, memberIdx })
                }
              />
            </div>
          ))}
          <button onClick={() => addMember(idx)}>Lägg till deltagare</button>
        </div>
      ))}
    </>
  )
}

export default Teams
