import { AxiosResponse } from 'axios'
import React, { useContext, useState } from 'react'
import { Toggle } from 'vtex.styleguide'
import { AuthContext } from '../context/authContext'
import { putCombination, deleteCombination } from '../service/api'
import { AuthType, SuggestionType } from '../typings/types'


type Props = {
  suggestion: SuggestionType
  productId: number
}

const Suggestion: React.FC<Props> = ({ suggestion, productId }) => {
  const { token } = useContext(AuthContext) as AuthType
  const [isActive, setIsActive] = useState(suggestion.isActive)

  const toggleSuggestion = async (item: number) => {
    if (!token) return
    let response: AxiosResponse
    if (isActive) {
      response = await deleteCombination(token, productId, item)
      setIsActive(false)
    } else {
      response = await putCombination(token, productId, item)
      setIsActive(true)
    }

    return response
  }

  return (
    <div className="flex items-center justify-between w-100 bb b--black-05 pb2 mt2">
      <div className="flex justify-start items-center">
        <div className="dtc w2 w3-ns v-mid">
          <img src={suggestion.image} alt={suggestion.name} />
        </div>
        <div className="dtc v-mid pl3">
          <strong className="f6 mt0 mb0 black-60">{suggestion.name}</strong>
        </div>
      </div>
      <Toggle
        onChange={() => {
          toggleSuggestion(suggestion.id)
        }}
        checked={isActive}
      />
    </div>
  )
}

export default Suggestion
