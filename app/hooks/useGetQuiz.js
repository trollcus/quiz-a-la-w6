import { useState, useEffect } from 'react'
import useSWR from 'swr'

const useGetQuiz = () => {
  const { data, error } = useSWR('/getQuiz', () =>
      fetch('/getQuiz').then(response => response.json())
    ),
    [Quiz, setQuiz] = useState(null)

  useEffect(() => {
    if (data) {
      const formatData = {
        categories: data.categories.reduce((categories, current) => {
          return [
            ...categories,
            {
              presenterText: current.presenterText,
              title: current.title,
              questions: Object.keys(current)
                .filter(key => key.includes('question'))
                .map(q => {
                  const newQ = q.split('_')

                  return {
                    id: `question_${newQ[1]}`,
                    question: current[`question_${newQ[1]}_title`],
                    answer: current[`question_${newQ[1]}_answer`],
                    media: current[`question_${newQ[1]}_media`],
                    revealed: false,
                  }
                })
                .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i),
            },
          ]
        }, []),
        activities: data.activities.reduce((categories, current) => {
          return [
            ...categories,
            {
              presenterText: current.presenterText,
              title: current.title,
              questions: Object.keys(current)
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
            },
          ]
        }, []),
        name: data.meta[0].name,
        teams: data.teams.reduce((teams, current) => {
          const { A, ...rest } = current
          return [
            ...teams,
            {
              name: current.A,
              members: Object.values(rest),
            },
          ]
        }, []),
      }

      setQuiz(formatData)
    }
  }, [data])

  return { quiz: Quiz, error }
}

export default useGetQuiz
