import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Dialog from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Select from 'material-ui/Select'
import { MenuItem } from 'material-ui/Menu'
import Checkbox from 'material-ui/Checkbox'

import { updateCharacter } from '../../../ducks/actions.js'
import { withArmorStats } from '../../../utils/propTypes'

class ArmorPopup extends React.Component {
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

    this.handleWeightChange = this.handleWeightChange.bind(this)
  }

  handleOpen() {
    this.setState({ open: true, character: this.props.character })
  }

  handleClose() {
    this.setState({ open: false })
  }

  handleChange(e) {
    e.preventDefault()
    let val = null

    if (e.target.type == 'checkbox') {
      val = ! this.state.character[e.target.name]
      this.props.updateChar(this.state.character.id, e.target.name, val)
    } else if (e.target.name == 'armor_tags') {
      val = e.target.value.split(',')
    } else
      val = e.target.value

    this.setState({ character: { ... this.state.character, [e.target.name]: val }})
  }

  handleWeightChange(e, key, value) {
    this.setState({ character: { ...this.state.character, armor_weight: value }})

    this.props.updateChar(this.state.character.id, 'armor_weight', value)
  }

  handleBlur(e) {
    e.preventDefault()
    const trait = e.target.name
    if (this.state.character[trait] == this.props.character[trait])
      return

    this.props.updateChar(this.state.character.id, trait, this.state.character[trait])
  }

  render() {
    const character = this.state.character
    const { handleOpen, handleClose, handleChange, handleBlur, handleWeightChange } = this

    const actions = [
      <Button
        key="close"
        label="Close"
        primary={ true }
        onClick={ handleClose }
      />
    ]

    // TODO show interesting calculated values here
    return <span>
      <Button onClick={ handleOpen }>Edit</Button>
      <Dialog
        title="Editing Armor"
        actions={ actions }
        open={ this.state.open }
        autoScrollBodyContent={ true }
        onRequestClose={ handleClose }
      >
        <div className="editor-popup editor-popup-armor">
          <div>
            <TextField label="Name:"
              name="armor_name" value={ character.armor_name }
              onChange={ handleChange } onBlur={ handleBlur } />
          </div>
          <div>

            <Select name="weight" value={ character.armor_weight }
              label="Weight:"
              onChange={ handleWeightChange }
            >
              <MenuItem value="unarmored" primarytext="Unarmored" />
              <MenuItem value="light" primarytext="Light" />
              <MenuItem value="medium" primarytext="Medium" />
              <MenuItem value="heavy" primarytext="Heavy" />
            </Select>
          </div>

          <Checkbox label="Artifact?" name="armor_is_artifact" checked={ character.armor_is_artifact }
            onCheck={ handleChange } />

          <div>
            <TextField name="armor_tags" value={ character.armor_tags }
              label="Tags:"
              onChange={ handleChange } onBlur={ handleBlur } />
          </div>

        </div>
      </Dialog>
    </span>
  }
}
ArmorPopup.propTypes = {
  character: PropTypes.shape(withArmorStats).isRequired,
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
)(ArmorPopup)