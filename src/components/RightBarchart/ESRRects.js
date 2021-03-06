import React from 'react'
import PropTypes from 'prop-types'
import { joinClassName as jcn } from '../utils'
import styles from './style.css'

export default class ESRRects extends React.Component {
  static propTypes = {
    translateX: PropTypes.number.isRequired,
    translateY: PropTypes.number.isRequired,
    highIncomeValue: PropTypes.number.isRequired,
    coreValue: PropTypes.number.isRequired,
    currCountry: PropTypes.object,
    country: PropTypes.object.isRequired,
    onItemClick: PropTypes.func,
    hoveredCountry: PropTypes.string,
    onItemHover: PropTypes.func,
    resetHoveredCountry: PropTypes.func,
  }

  onClick = () => {
    const { country, onItemClick } = this.props
    if (onItemClick !== undefined) onItemClick(country)
  }

  onMouseOver= () => {
    const { hoveredCountry, country, onItemHover } = this.props
    if ((!hoveredCountry || country.countryCode !== hoveredCountry) && onItemHover !== undefined) onItemHover(country.countryCode)
  }

  onMouseOut= () => {
    const { hoveredCountry, resetHoveredCountry } = this.props
    if (hoveredCountry !== null && resetHoveredCountry !== undefined) resetHoveredCountry()
  }

  render() {
    const { translateX, translateY, highIncomeValue, coreValue, currCountry, country, onItemClick } = this.props
    const maxValue = Math.max(highIncomeValue, coreValue)
    const isActive = currCountry && currCountry === country
    return (
      <g
        className={jcn({ esrRect: true, clickable: onItemClick !== undefined }, styles)}
        transform={'translate(' + translateX + ', ' + translateY + ')'}
        onClick={this.onClick}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        opacity={currCountry === country || !currCountry ? 1 : 0.5}
        data-for="bar-chart-tooltip"
        data-tip={country.countryName}>
        >
        <rect y={-maxValue || 0} height={maxValue || 0} width='9' x='-4.5' fill={isActive ? '#a1e2bc' : 'rgba(0, 0, 0, .1)'}></rect>
        { coreValue &&
          <g className="-circle-core">
            <circle className='core' cy={-coreValue} r='7' fill='#00b95f'></circle>
          </g>
        }
        { highIncomeValue &&
          <g className="-circle-high-income">
            <circle className='high' cy={-highIncomeValue} r='8' fill='#00b95f'></circle>
            <circle className='high' cy={-highIncomeValue} r='4' fill='#00b95f' strokeWidth='3' stroke='#fff'></circle>
          </g>
        }
      </g>
    )
  }
}
