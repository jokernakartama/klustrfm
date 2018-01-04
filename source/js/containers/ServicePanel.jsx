import React from 'react'
import Partition from '~/components/servicepanel/Partition'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as servicePanelActions from '~/ducks/servicePanel'

class ServicePanel extends React.Component {
  static propTypes = {
    actions: PropTypes.object,
    services: PropTypes.object,
    current: PropTypes.string,
    path: PropTypes.string,
    changeDirectory: PropTypes.func,
    isTrash: PropTypes.bool
  }

  render () {
    const { services, current } = this.props
    const { addService, connectService } = this.props.actions
    return (
      <section className="service-panel">
        <ul className="service-list">
          { Object.keys(services).map((key, index) => {
             return (
               <Partition
               name={ key }
               mounted={ services[key].mounted }
               active={ key === current }
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
    current: state.filemanager.service,
    path: state.filemanager.path,
    isTrash: state.filemanager.isTrash,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(servicePanelActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServicePanel)
