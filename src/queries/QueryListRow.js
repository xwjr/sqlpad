import React from 'react'
import { Link } from 'react-router-dom'
import Label from 'react-bootstrap/lib/Label'
import DeleteButton from '../common/DeleteButton'

class QueryListRow extends React.Component {
  handleMouseOver = e => {
    const { handleQueryListRowMouseOver, query } = this.props
    handleQueryListRowMouseOver(query)
  }

  handleDeleteClick = e => {
    const { handleQueryDelete, query } = this.props
    handleQueryDelete(query._id)
  }

  render() {
    const { config, query, selectedQuery } = this.props

    const tagLabels = query.tags.map(tag => (
      <Label bsStyle="info" key={tag} style={{ marginLeft: 4 }}>
        {tag}
      </Label>
    ))

    const tableUrl = `${config.baseUrl}/query-table/${query._id}`
    const chartUrl = `${config.baseUrl}/query-chart/${query._id}`

    const classNames = ['list-group-item', 'QueryListRow']
    if (selectedQuery && selectedQuery._id === query._id) {
      classNames.push('QueryListRowSelected')
    }

    return (
      <li
        onClick={this.onClick}
        className={classNames.join(' ')}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.onMouseOut}
      >
        <h4>
          <Link to={'/queries/' + query._id}>{query.name}</Link>
        </h4>
        <p>
          {query.createdBy} {tagLabels}
        </p>
        <p>
          <a href={tableUrl} target="_blank" rel="noopener noreferrer">
            table
          </a>{' '}
          <a href={chartUrl} target="_blank" rel="noopener noreferrer">
            chart
          </a>
        </p>
        <DeleteButton onClick={this.handleDeleteClick} />
      </li>
    )
  }
}

export default QueryListRow
