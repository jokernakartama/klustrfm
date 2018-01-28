import React from 'react'
import Partition from '~/components/servicepanel/Partition'
import PropTypes from 'prop-types'
import CrossTab from 'cross-tab-channel'
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
  
  constructor () {
    super()
    this.channel = new CrossTab('service_token_updates')
  }
  
  componentWillMount () {
    const { connectService, disconnectService } = this.props.actions
    this.channel.listen(function (data) {
      if (data.connect) {
        connectService(data.service)
      } else {
        disconnectService(data.service)
      }
    })
  }

  componentWillUnmount () {
    this.channel.remove(this.channel)
  }

  render () {
    const { services, current } = this.props
    const { addService, connectService, disconnectService } = this.props.actions
    return (
      <section className="service-panel">
        <ul className="service-list">
          { Object.keys(services).map((service, index) => {
             return (
               <Partition
                name={ service }
                expiresAt={ services[service].expiresAt }
                mounted={ services[service].mounted }
                active={ service === current }
                key={ 'service_' + index }
                mount={
                  () => {
                    addService(service, () => this.channel.emit({
                      service,
                      connect: true
                    }))
                  }
                }
                unmount={
                  () => {
                    disconnectService(service)
                    this.channel.emit({
                      service,
                      connect: false
                    })
                  }
                }
                connect={ () => { connectService(service)} } 
               />
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
