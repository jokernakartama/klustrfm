import React from 'react'
import PropTypes from 'prop-types'
import AX from '~/utilities/ajax'

const STATIC_PAGES_DIR = 'static/klustr/pages/'
const PAGES_EXTENSION = '.md'

class StaticPage extends React.Component {
  static propTypes = {
    pageName: PropTypes.string.isRequired,
  }

  constructor () {
    super()
    this.state = {
      content: '',
      loading: true
    }
  }

  componentDidMount () {
    AX.get(STATIC_PAGES_DIR + this.props.pageName + PAGES_EXTENSION)
      .status({
        'success': 200,
        'error': '!200',
        'anyway': 'all'
      })
      .on('success', (body) => {
        this.setState({
          content: body
        })
      })
      .on('error', () => {
        this.setState({
          content: 'Sorry no content X('
        })
      })
      .on('anyway', () => {
        this.setState({
          loading: false
        })
      })
      .send()
  }
  render () {
    const {
      content,
      loading
    } = this.state
    
    return (
      <div className="page">
        { loading ? 'LOADING' : content }
      </div>
    )
  }
}

export default StaticPage
