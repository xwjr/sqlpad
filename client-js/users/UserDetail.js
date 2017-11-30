import React from 'react'
import fetchJson from '../utilities/fetch-json.js'
import Alert from 'react-s-alert'
import UserList from './UserList'
import InviteUserForm from './InviteUserForm'
import Form from 'react-bootstrap/lib/Form'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import Table from 'react-bootstrap/lib/Table'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import Button from 'react-bootstrap/lib/Button'
import moment from 'moment'
import DeleteButton from '../common/DeleteButton'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import Popover from 'react-bootstrap/lib/Popover'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'

class UsersView extends React.Component {
  state = {
    users: [],
    connections: [],
    selectedConnectionIndex: '',
    userConnections: [],
    isSaving: false
  }

  componentDidMount() {
    document.title = 'SQLPad - Users'
    this.loadConnectionsFromServer()
    console.log(this.props)
    this.onAddConnectionClick = this.onAddConnectionClick.bind(this)
    this.loadUserConnectionsFromServer()
  }

  loadConnectionsFromServer = () => {
    fetchJson('GET', '/api/connections').then(json => {
      this.setState({ connections: json.connections })
    })
  }

  loadUserConnectionsFromServer = () => {
    var userId = this.props.userId
    fetchJson('GET', `/api/users/${userId}/connections`).then(json => {
      console.log(json)
      this.setState({ userConnections: json.connections })
    })
  }

  handleDeleteClick = name => {
    var userId = this.props.userId
    fetchJson(
      'DELETE',
      `/api/users/${userId}/connections/${name}`
    ).then(json => {
      this.loadUserConnectionsFromServer()
    })
  }

  onAddConnectionClick(e) {
    var selectedConnectionIndex = this.state.selectedConnectionIndex
    var connection = this.state.connections[selectedConnectionIndex]
    if (!selectedConnectionIndex) {
      return Alert.error('please choose connection name')
    }
    var newConnection = {
      connectionId: connection._id,
      name: connection.name,
      userId: this.props.userId
    }
    this.setState({
      isInviting: true
    })
    fetchJson('POST', '/api/users/connections', newConnection).then(json => {
      this.setState({
        isInviting: false
      })
      if (json.error) {
        return Alert.error(
          'Add user connections failed: ' + json.error.toString()
        )
      }
      Alert.success('Add user connections success')
      this.loadUserConnectionsFromServer()
    })
  }

  render() {
    const { config, currentUser } = this.props
    var createdByConnectionsOptions = this.state.connections.map(function(
      item,
      index
    ) {
      return (
        <option key={item._id} value={index}>
          {item.name}
        </option>
      )
    })
    var self = this
    var createdByUserConnectionsOptions = this.state.userConnections.map(
      function(item, index) {
        const popoverClick = (
          <Popover id="popover-trigger-click" title="Are you sure?">
            <Button
              bsStyle="danger"
              onClick={self.handleDeleteClick.bind(this, item.name)}
              style={{ width: '100%' }}
            >
              delete
            </Button>
          </Popover>
        )
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.name}</td>
            <td>{item.driver}</td>
            <td>{moment(item.createdDate).format('YYYY-MM-DD')}</td>
            <td>{moment(item.modifiedDate).format('YYYY-MM-DD')}</td>
            <td style={{ textAlign: 'center' }}>
              <OverlayTrigger
                trigger="click"
                placement="left"
                rootClose
                overlay={popoverClick}
              >
                <a href="#delete">
                  <Glyphicon glyph="trash" />
                </a>
              </OverlayTrigger>
            </td>
          </tr>
        )
      }
    )
    return (
      <div
        className="flex-100"
        style={{ height: '100px', width: '1000px', marginLeft: '20px' }}
      >
        <div>
          <Form horizontal style={{ marginLeft: '15px' }}>
            <h3>Add connections to {this.props.email}</h3>
            <FormGroup controlId="connections" style={{ float: 'left' }}>
              <ControlLabel />{' '}
              <FormControl
                style={{
                  maxWidth: 300
                }}
                componentClass="select"
                value={this.state.selectedConnectionIndex}
                onChange={e => {
                  this.setState({
                    selectedConnectionIndex: e.target.value
                  })
                }}
              >
                <option value="">choose connections to auth</option>
                {createdByConnectionsOptions}
              </FormControl>
            </FormGroup>
            <Button
              bsStyle="primary"
              style={{ marginLeft: '30px', marginTop: '18px' }}
              onClick={this.onAddConnectionClick}
            >
              add
            </Button>
          </Form>
          <br />
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>#</th>
                <th>name</th>
                <th>driver</th>
                <th>created</th>
                <th>modified</th>
                <th>operate</th>
              </tr>
            </thead>
            <tbody>{createdByUserConnectionsOptions}</tbody>
          </Table>
        </div>
      </div>
    )
  }
}

export default UsersView
