import React from 'react'
import PropTypes from 'prop-types'
import TopNav from '../TopNav/'
import BetaLogo from '../BetaLogo/'
import { joinClassName as jcn } from '../utils'
import styles from './styles.css'

export default class TopMenu extends React.Component {
  static propTypes = {
    content: PropTypes.object.isRequired,
  }
  render() {
    const { content } = this.props
    const joinClassName = jcn({
      wrapper: true,
    }, styles)
    return (
      <div className={joinClassName}>
        <div className={styles.logo}>
          <a href='https://humanrightsmeasurement.org/' target='_blank'><BetaLogo /></a>
        </div>
        <TopNav content={content} />
      </div>
    )
  }
}
