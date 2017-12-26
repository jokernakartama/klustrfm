import React from 'react'
import Partition from '~/components/servicepanel/Partition'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as servicePanelActions from '~/ducks/servicePanel'


class ServicePanel extends React.Component {
  static propTypes = {
    actions: PropTypes.object,
    services: PropTypes.object
  }

  render () {
    const { services } = this.props
    const { addService, connectService } = this.props.actions
    return (
      <section className="service-panel">
        <ul className="service-list">
          { Object.keys(services).map((key, index) => {
             return (
               <Partition
               name={ key }
               mounted={ services[key].mounted }
               key={ 'service' + index }
               mount={ () => { addService(key) } }
               connect={ () => { connectService(key) } } />
              )
            })
          }
        </ul>
      </section>
    )
  }
}

function mapStateToProps (state) {
  return {
    services: state.services,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(servicePanelActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServicePanel)
