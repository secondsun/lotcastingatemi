import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import { updateCharacter } from '../../../ducks/actions.js'
import { withSpecialties } from '../../../utils/propTypes'

import ExpandableListEditor from '../../generic/expandableListEditor.jsx'

class SpecialtyPopup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      character: this.props.character
    }

    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)

    this.onListChange = this.onListChange.bind(this)
    this.onListBlur = this.onListBlur.bind(this)
  }

  handleOpen() {
    this.setState({ open: true, character: this.props.character })
  }

  handleClose() {
    this.setState({ open: false })
  }

  handleChange(e) {
    e.preventDefault()

    const val = parseInt(e.target.value)

    this.setState({ character: { ... this.state.character, [e.target.name]: val }})
  }

  handleBlur(e) {
    e.preventDefault()
    const trait = e.target.name
    if (this.state.character[trait] == this.props.character[trait])
      return

    this.props.updateChar(this.state.character.id, trait, this.state.character[trait])
  }

  onListChange(trait, value) {
    this.setState({ character: { ...this.state.character, [trait]: value }})
    this.props.updateChar(this.state.character.id, trait, value)
  }

  onListBlur(trait, value) {
    this.setState({ character: { ...this.state.character, [trait]: value }})
    this.props.updateChar(this.state.character.id, trait, value)
  }

  render() {
    const character = this.state.character
    const { handleOpen, handleClose, onListChange, onListBlur } = this

    const actions = [
      <FlatButton
        key="close"
        label="Close"
        primary={ true }
        onTouchTap={ handleClose }
      />
    ]

    return(<div className="editor-wrap ability-editor-wrap">
      <FlatButton label="Edit" onClick={ handleOpen } />
      <Dialog
        title="Editing Abilities"
        actions={ actions }
        open={ this.state.open }
        autoScrollBodyContent={ true }
        onRequestClose={ handleClose }
      >
        <div className="editor-popup editor-popup-specialties">
          <ExpandableListEditor character={ character } trait="specialties"
            onUpdate={ onListChange } onBlur={ onListBlur }
          />
        </div>
      </Dialog>
    </div>)
  }
}
SpecialtyPopup.propTypes = {
  character: PropTypes.shape(withSpecialties).isRequired,
  updateChar: PropTypes.func
}

function mapDispatchToProps(dispatch) {
  return {
    updateChar: (id, trait, value) => {
      dispatch(updateCharacter(id, trait, value))
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(SpecialtyPopup)
