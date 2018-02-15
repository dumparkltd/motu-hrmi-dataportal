import React from 'react'
import PropTypes from 'prop-types'
import SubTopNav from '../SubTopNav/'
import RightsItem from './RightsItem'
import RegionSelector from './RegionSelector'
import RightBarchart from '../RightBarchart/'
import ESRTimeline from '../ESRTimeline/'
import QuestionTooltip from '../QuestionTooltip'
import DownloadPopup from '../DownloadPopup'
// import SortbyDropdown from '../SortbyDropdown'
import RightDefinition from '../RightDefinition'
import WordCloudChart from '../WordCloudChart'
import { segsToUrl, joinClassName as jcn } from '../utils'
import styles from './style.css'
import rightsDefinitions from 'data/rights-definitions.json'

export default class RightsPage extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    urlSegs: PropTypes.object.isRequired,
    urlPush: PropTypes.func.isRequired,
    content: PropTypes.object.isRequired,
  }

  constructor() {
    super()
    this.state = {
      currCountry: null,
      chartHeight: 0,
      chartWidth: 0,
      currYear: 2015,
      rightPaneWidth: 0,
      // sortby: 'Name',
    }
  }

  componentDidMount() {
    const { charts, rightPane } = this.refs
    this.setState({ chartHeight: charts.offsetHeight, chartWidth:  charts.offsetWidth, rightPaneWidth: rightPane.offsetWidth })
  }

  setExploreBy = (right) => {
    const { urlSegs } = this.props
    this.props.urlPush(segsToUrl({ ...urlSegs, exploreBy: 'Geography', right: 'all', country: undefined }))
  }

  setRegion = (region) => {
    this.setState({ currCountry: null })
    this.props.urlPush(segsToUrl({ ...this.props.urlSegs, region: region, country: undefined }))
  }

  setRight = (right) => {
    this.props.urlPush(segsToUrl({ ...this.props.urlSegs, right: right }))
  }

  setCountry = () => {
    this.props.urlPush(segsToUrl({ ...this.props.urlSegs, exploreBy: 'Geography', country: this.state.currCountry.countryCode, right: 'all' }))
  }

  setCurrCountry = (country) => {
    if (this.state.currCountry === null || country.countryCode !== this.state.currCountry.countryCode) {
      this.setState({ currCountry: country })
    } else {
      this.setState({ currCountry: null })
    }
  }

  resetCurrCountry = () => {
    this.setState({ currCountry: null })
  }

  setCurrYear = (year) => {
    this.setState({ currYear: year })
  }

  // setSortby = (name) => {
  //   this.setState({ sortby: name })
  // }

  gotoCPRPilot = () => {
    this.props.urlPush(segsToUrl({ ...this.props.urlSegs, region: 'cpr-pilot' }))
  }

  render() {
    const { data: { rightsByRegion }, urlSegs, content } = this.props
    const tooltips = content.question_tooltips
    const rights = Object.entries(rightsDefinitions).map(([code, right]) => ({ code, ...right }))
    const ESRs = rights.filter(right => right.type === 'ESR')
    const CPRs = rights.filter(right => right.type === 'CPR')

    const ESRItems = ESRs.map((right, i) => (
      <RightsItem key={right.code} right={right.code} onItemClick={this.setRight} selected={right.code === urlSegs.right} content={content}>
        {content.rights_name[right.code]}
      </RightsItem>
    ))
    const CPRItems = CPRs.map((right, i) => (
      <RightsItem key={right.code} right={right.code} onItemClick={this.setRight} selected={right.code === urlSegs.right} content={content}>
        {content.rights_name[right.code]}
      </RightsItem>
    ))

    const isESRSelected = ESRs.some(r => r.code === urlSegs.right)
    const isCPRSelected = CPRs.some(r => r.code === urlSegs.right)

    const colorClassName = jcn({
      rightInfo: true,
      esrs: isESRSelected,
      cprs: isCPRSelected,
    }, styles)

    const rightsByRegionCountries = rightsByRegion[urlSegs.region].countries
    const cloudWords = this.state.currCountry && isCPRSelected ? this.state.currCountry.rights.cprRangeAtRisk[urlSegs.right].map(word => {
      return { text: word[0], value: word[1] }
    }) : ''

    return (
      <div className={styles.rightsPage}>
        <SubTopNav />
        <div className='row'>
          <div className='column'>
            <div className={styles.columnLeft}>
              <div className={styles.regionSelectorWrapper}>
                <RegionSelector content={content} selectRetionText={content.select_region} rightsByRegion={rightsByRegion} urlSegs={urlSegs} isActive={isESRSelected} onItemClick={this.setRegion} />
              </div>
              <div className={styles.rightsWrapper}>
                <div className={styles.rightList}>
                  <div className={styles.ESRTitle}>{content.rights_category.esr}</div>
                  <ul>
                    {ESRItems}
                  </ul>
                  <div className={styles.CPRTitle}>{content.rights_category.cpr}</div>
                  <ul>
                    {CPRItems}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className='column'>
            <div className={styles.chartsHeader}>
              <div className={styles.regionName}><span style={{ color: isESRSelected ? '#00af49' : '#2e65a1' }}>{content.rights_name[urlSegs.right]}</span> {content.in} {content.region_name[urlSegs.region]}</div>
              {/* <div className={styles.sortBy} style={{ opacity: (isESRSelected || urlSegs.region === 'cpr-pilot') ? 1 : 0 }}><SortbyDropdown regionCode={urlSegs.region} sortby={this.state.sortby} onItemClick={this.setSortby} /></div> */}
              { isESRSelected
                ? <div className={styles.esrLegend}>
                  <div className={styles.text}>{content.legend.esr_barchart[0]}</div>
                  <div className={styles.text}>{content.legend.esr_barchart[1]}</div>
                </div>
                : <div className={styles.cprLegend}>
                  <div className={styles.meanText}>{content.legend.cpr_barchart[0]}</div>
                  <div className={styles.bar}></div>
                  <div className={styles.textContainer}>
                    <div className={styles.maxText}>90<sup>th</sup> {content.legend.cpr_barchart[1]}</div>
                    <div className={styles.minText}>10<sup>th</sup> {content.legend.cpr_barchart[1]}</div>
                  </div>
                </div>
              }
            </div>
            <div className={styles.chartsContainer} ref='charts'>
              { isESRSelected || urlSegs.region === 'cpr-pilot'
                ? <RightBarchart
                  isESR={rightsDefinitions[urlSegs.right].type === 'ESR'}
                  currRight={urlSegs.right}
                  rightsByRegionCountries={rightsByRegionCountries}
                  chartHeight={this.state.chartHeight * 0.6}
                  chartWidth={this.state.chartWidth}
                  currCountry={this.state.currCountry}
                  onItemClick={this.setCurrCountry}
                  resetCurrCountry={this.resetCurrCountry} />
                : <div className={styles.CPRAlertWrapper}>
                  <div className={styles.CPRAlert}>
                    {content.cpr_alert.text} <u>{content.cpr_alert.underline_text}</u>
                    <div className={styles.button}><button onClick={this.gotoCPRPilot}>{content.cpr_alert.button_text}</button></div>
                  </div>
                </div>
              }
              { isESRSelected &&
                <ESRTimeline
                  data={rightsByRegionCountries}
                  chartHeight={this.state.chartHeight * 0.4}
                  chartWidth={this.state.chartWidth}
                  currYear={this.state.currYear}
                  currRight={urlSegs.right}
                  onItemClick={this.setCurrYear}
                />
              }
            </div>
            <div className={styles.chartsFooter}>
              <div className={styles.downloadPopupWrapper}><DownloadPopup itemList={ESRs.indexOf(urlSegs.right) > -1 ? ['bar chart', 'line chart'] : ['bar chart']} content={content} /></div>
              <div className={styles.text}>{isESRSelected ? content.footer_text.rights_page_esr : content.footer_text.rights_page_cpr}</div>
              <div className={styles.source}>{content.footer_text.source} <a className={styles.small} href='https://humanrightsmeasurement.org'>https://humanrightsmeasurement.org</a></div>
            </div>
          </div>
          <div className='column' ref='rightPane'>
            <div className={styles.infoHeader}>
              <div className={colorClassName}>
                <div className={styles.rightName}>Right to {urlSegs.right}</div>
                <div className={styles.regionName}>{content.in} {this.state.currCountry ? this.state.currCountry.countryName : content.region_name[urlSegs.region]}</div>
              </div>
              <div className='arrowLink'>
                <div className='text'>{content.explore_all_rights_in}:</div>
                <div className='text underline' onClick={this.setExploreBy}>{content.region_name[urlSegs.region]}</div>
                { this.state.currCountry !== null &&
                  <div className='text underline' onClick={this.setCountry}>{this.state.currCountry.countryName}</div>
                }
              </div>
            </div>
            <div className={styles.infoContent}>
              <div className={styles.textWrapper}>
                <RightDefinition right={urlSegs.right} isESRSelected={isESRSelected} tooltips={tooltips} content={content} />
                { !isESRSelected && cloudWords.length !== 0 &&
                  <div>
                    <QuestionTooltip width={214} question={content.cpr_at_risk.title} isTitle={true}>
                      <p>{content.cpr_at_risk.tooltip} <a href='#' target='_blank'>{content.cpr_at_risk.link}</a>.</p>
                    </QuestionTooltip>
                    <WordCloudChart
                      width={this.state.rightPaneWidth - 10}
                      height={cloudWords.length * 20}
                      words={cloudWords}
                    />
                    <QuestionTooltip width={220} question={content.cpr_abuse.title} isTitle={true}>
                      <p>{content.cpr_abuse.tooltip}</p>
                    </QuestionTooltip>
                    <div className={styles.cprChartSubtitle}>{content.cpr_abuse.subtitle}</div>
                    <div className={styles.chartKeys}>
                      <strong>A:</strong> {content.cpr_abuse.keys[0]}, <strong>B:</strong> {content.cpr_abuse.keys[1]}, <strong>C:</strong> {content.cpr_abuse.keys[2]}, <strong>D:</strong> {content.cpr_abuse.keys[3]}, <strong>E:</strong> {content.cpr_abuse.keys[4]}
                    </div>
                  </div>
                }
                { (isESRSelected && this.state.currCountry) &&
                  <div>
                    <div className={styles.subtitleESR}>{content.esr_trend.title}</div>
                    <div className={styles.esrChartKey}>{content.esr_trend.subtitle}</div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
