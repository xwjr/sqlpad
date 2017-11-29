import React from 'react'
import PropTypes from 'prop-types'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import Button from 'react-bootstrap/lib/Button'
import ChartInputs from './ChartInputs.js'
import chartDefinitions from '../utilities/chartDefinitions.js'

class VisSidebar extends React.Component {
  render() {
    const {
      isChartable,
      onChartConfigurationFieldsChange,
      onChartTypeChange,
      onSaveImageClick,
      onVisualizeClick,
      query,
      queryResult
    } = this.props

    const chartOptions = chartDefinitions.map(d => {
      return (
        <option key={d.chartType} value={d.chartType}>
          {d.chartLabel}
        </option>
      )
    })

    return (
      <div className="sidebar">
        <div className="sidebar-body">
          <FormGroup controlId="formControlsSelect" bsSize="small">
            <FormControl
              value={query.chartConfiguration.chartType}
              onChange={onChartTypeChange}
              componentClass="select"
              className="input-small"
            >
              <option value="">Choose a chart type...</option>
              {chartOptions}
            </FormControl>
          </FormGroup>
          <ChartInputs
            chartType={query.chartConfiguration.chartType}
            queryChartConfigurationFields={query.chartConfiguration.fields}
            onChartConfigurationFieldsChange={onChartConfigurationFieldsChange}
            queryResult={queryResult}
          />
        </div>
        <div className="sidebar-actions-bottom">
          <Button
            onClick={onVisualizeClick}
            disabled={!isChartable}
            className={'btn-block'}
            bsSize={'sm'}
          >
            Visualize
          </Button>
          <Button
            onClick={onSaveImageClick}
            className={'btn-block'}
            bsSize={'sm'}
          >
            <Glyphicon glyph="save" /> Save Chart Image
          </Button>
        </div>
      </div>
    )
  }
}

VisSidebar.propTypes = {
  isChartable: PropTypes.bool,
  onChartConfigurationFieldsChange: PropTypes.func,
  onChartTypeChange: PropTypes.func,
  onSaveImageClick: PropTypes.func,
  onVisualizeClick: PropTypes.func,
  query: PropTypes.object,
  queryResult: PropTypes.object
}

export default VisSidebar
