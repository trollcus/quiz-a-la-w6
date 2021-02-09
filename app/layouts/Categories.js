import React from 'react'
import tw, { styled, css } from 'twin.macro'

const CategoryCard = styled.div`
  ${tw`flex items-center justify-center w-1/3 p-8 mx-6 my-2 text-xl text-center bg-blue-400 rounded-xl h-36`}
`

const Categories = ({ categories, category }) => {
  console.log(category)
  return (
    <div tw="w-full h-full bg-blue-300">
      {category ? (
        <div tw="w-full h-full flex flex-col items-start justify-center p-24">
          <h1 tw="text-3xl mb-8 font-bold">{category.title}</h1>
          {category.questions.map(q => (
            <>
              {q.revealed && (
                <p key={q.id} tw="text-2xl mb-8">
                  {q.question}
                </p>
              )}
            </>
          ))}
        </div>
      ) : (
        <div tw="w-full h-full flex flex-col items-center justify-center">
          <div tw="flex w-full items-center justify-around px-12 flex-wrap">
            {categories.map(category => (
              <CategoryCard key={category.title}>
                <p>{category.title}</p>
              </CategoryCard>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories
