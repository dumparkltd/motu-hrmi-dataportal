import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

export default class BarChartCPR extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
  }

  constructor() {
    super()
    this.state = { containerWidth: 0 }
  }

  componentDidMount() {
    this.fitContainer()
    window.addEventListener('resize', this.fitContainer)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.fitContainer)
  }

  fitContainer = () => {
    const currentWidth = this.refs.chartContainer.offsetWidth
    const shouldResize = this.state.containerWidth !== currentWidth
    if (shouldResize) {
      this.setState({ containerWidth: currentWidth })
    }
  }

  render() {
    const { height, data } = this.props
    const { containerWidth } = this.state
    const axis = [
      { height: 0.2 * height, text: '10' },
      { height: 0.6 * height, text: '5' },
      { height: height, text: '0' },
    ]
    const bars = data.map((right, index) => {
      const x = containerWidth / 7 * (index + 1) - 0.05 * containerWidth
      const rectHeight = d3.scaleLinear().range([0, 0.8 * height]).domain([0, 10])
      return (
        <g key={index}>
          <rect x={x} y={height - rectHeight(right.value)} width={0.05 * containerWidth} height={rectHeight(right.value)} fill="#00A551"/>
          <line x1={x} y1={height - rectHeight(right.maxValue)} x2={x + 0.05 * containerWidth} y2={height - rectHeight(right.maxValue)} stroke="red" strokeWidth="2" opacity="0.4"/>
          <line x1={x} y1={height - rectHeight(right.minValue)} x2={x + 0.05 * containerWidth} y2={height - rectHeight(right.minValue)} stroke="red" strokeWidth="2" opacity="0.4"/>
          <line x1={x + 0.025 * containerWidth} y1={height - rectHeight(right.maxValue)} x2={x + 0.025 * containerWidth} y2={height - rectHeight(right.minValue)} stroke="red" strokeWidth="2" opacity="0.4"/>
        </g>
      )
    })
    return (
      <div ref='chartContainer'>
        <svg width={containerWidth} height={height}>
          {axis.map((line, index) => {
            if (index < 2) {
              return (
                <g key={index}>
                  <text x="0" y={line.height - 2}>{line.text}</text>
                  <line x1="0" y1={line.height} x2={containerWidth} y2={line.height} stroke="#00A551" opacity="0.25" />
                </g>
              )
            } else {
              return (
                <g key={index}>
                  <text x="0" y={line.height - 2}>{line.text}</text>
                  <line x1="0" y1={line.height} x2={containerWidth} y2={line.height} stroke="#00A551" />
                </g>
              )
            }
          })}
          {bars}
        </svg>
      </div>
    )
  }
}
