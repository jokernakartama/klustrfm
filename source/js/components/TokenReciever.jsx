import React from 'react'
import { CloudAPI } from '~/api'

class TokenReciever extends React.Component {
  render () {
    if (CloudAPI.postCode()) {
      return <div> Recieving the token... </div>
    } else {
      return <div> Cannot parse url </div>
    }
  }
}

export default TokenReciever
