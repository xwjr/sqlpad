import React from 'react'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import ListGroup from 'react-bootstrap/lib/ListGroup'
import QueryListRow from './QueryListRow'

class QueryList extends React.Component {
  render() {
    var self = this
    var QueryListRows = this.props.queries.map(query => {
      return (
        <QueryListRow
          config={this.props.config}
          key={query._id}
          query={query}
          selectedQuery={this.props.selectedQuery}
          handleQueryDelete={this.props.handleQueryDelete}
          handleQueryListRowMouseOver={self.props.handleQueryListRowMouseOver}
        />
      )
    })
    return (
      <div className="QueryList">
        <ControlLabel>Queries</ControlLabel>
        <ListGroup className="QueryListContents">{QueryListRows}</ListGroup>
      </div>
    )
  }
}

export default QueryList
