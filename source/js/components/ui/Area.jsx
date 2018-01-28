import React from 'react'
import PropTypes from 'prop-types'
import { Scrollbars } from 'react-custom-scrollbars'

class Area extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
    className: PropTypes.string
  }

  render () {
    const { style, className, children } = this.props
    
    const scrollArea = (props) => {
      return (
        <div
          {...props}
          className={
            'scroll-area' +
            (className ? className : '')
          }
        />
      )
    }
    const scrollAreaTrackHorizontal = (props) => {
      return (
        <div
          {...props}
          className={
            'scroll-area__track scroll-area__track_position_horizontal' +
            (className ? ' ' + className + '__track ' + className + '__track_position_horizontal' : '')
          }
        />
      )
    }
    const scrollAreaTrackVertical = (props) => {
      return (
        <div
          {...props}
          className={
            'scroll-area__track scroll-area__track_position_vertical' + 
            (className ? ' ' + className + '__track ' + className + '__track_position_vertical' : '')
          }
        />
      )
    }
    const scrollAreaThumbHorizontal = (props) => {
      return (
        <div
          {...props}
          className={
            'scroll-area__thumb scroll-area__thumb_position_horizontal' +
            (className ? ' ' + className + '__thumb ' + className + '__thumb_position_horizontal' : '')
          }
        />
      )
    }
    const scrollAreaThumbVertical = (props) => {
      return (
        <div
          {...props}
          className={
            'scroll-area__thumb scroll-area__thumb_position_vertical' + 
            (className ? ' ' + className + '__thumb ' + className + '__thumb_position_vertical' : '')
          }
        />
      )
    }   
    
    const defaults = {
      autoHide: true,
      autoHeight: true,
      renderView: scrollArea,
      thumbMinSize: 30,
      renderTrackHorizontal: props => scrollAreaTrackHorizontal(props),
      renderTrackVertical: props => scrollAreaTrackVertical(props),
      renderThumbHorizontal: props => scrollAreaThumbHorizontal(props),
      renderThumbVertical: props => scrollAreaThumbVertical(props)
    }
    return (
      <Scrollbars {...defaults} style={ style }>
        { children }
      </Scrollbars>
    )
  }
}

export default Area
