import React from 'react'
import moment from 'moment'
import Form from 'react-bootstrap/lib/Form'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import Checkbox from 'react-bootstrap/lib/Checkbox'
import Col from 'react-bootstrap/lib/Col'
import Button from 'react-bootstrap/lib/Button'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import PasswordResetButtonLink from './PasswordResetButtonLink'
import DeleteButton from '../common/DeleteButton'
import fetchJson from '../utilities/fetch-json.js'
import Alert from 'react-s-alert'
import { LinkContainer } from 'react-router-bootstrap'

class UserListRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedConnectionIndex: ''
    }
  }
  handleDeleteClick = e => {
    const { user, handleDelete } = this.props
    handleDelete(user)
  }

  handleRoleChange = e => {
    const { user, updateUserRole } = this.props
    user.role = e.target.value
    updateUserRole(user)
  }

  generatePasswordResetLink = () => {
    const { generatePasswordResetLink, user } = this.props
    generatePasswordResetLink(user)
  }

  removePasswordResetLink = () => {
    const { removePasswordResetLink, user } = this.props
    removePasswordResetLink(user)
  }

  render() {
    const { user, currentUser } = this.props
    const signupDate = !user.signupDate ? (
      <em>not signed up yet</em>
    ) : (
      moment(user.signupDate).calendar()
    )

    return (
      <li className={'list-group-item ListRow'}>
        <h4>{user.email}</h4>
        <h5>{signupDate}</h5>
        <PasswordResetButtonLink
          passwordResetId={user.passwordResetId}
          generatePasswordResetLink={this.generatePasswordResetLink}
          removePasswordResetLink={this.removePasswordResetLink}
        />
        {currentUser._id !== user._id && (
          <DeleteButton onClick={this.handleDeleteClick} />
        )}
        <Form>
          <FormGroup controlId="role">
            <ControlLabel>Role</ControlLabel>{' '}
            <FormControl
              style={{
                maxWidth: 300
              }}
              componentClass="select"
              value={user.role}
              disabled={currentUser._id === user._id}
              onChange={this.handleRoleChange}
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </FormControl>
          </FormGroup>
          {currentUser._id !== user._id && (
            <LinkContainer to={`/users/${user._id}/${user.email}`}>
              <Button bsStyle="primary">more</Button>
            </LinkContainer>
          )}
        </Form>
      </li>
    )
  }
}

export default UserListRow
