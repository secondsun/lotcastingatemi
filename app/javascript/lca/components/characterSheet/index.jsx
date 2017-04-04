import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Divider from 'material-ui/Divider'

import { updateCharacter } from '../../actions'

import CombatBlock from './combatBlock.jsx'
import SocialBlock from './socialBlock.jsx'
import FullAttributeBlock from './fullAttributeBlock.jsx'
import FullAbilityBlock from './fullAbilityBlock.jsx'
import WeaponSummary from './weaponSummary.jsx'
import ArmorSummary from './armorSummary.jsx'
import HealthLevelBlock from './healthLevelBlock.jsx'

import SpecialtyPopup from './editors/specialtyPopup.jsx'
import IntimacyPopup from './editors/intimacyPopup.jsx'
import WillpowerPopup from './editors/willpowerPopup.jsx'
import AllMeritsPopup from './editors/allMeritsPopup.jsx'
import BasicsEditorPopup from './editors/basicsEditorPopup.jsx'

import RatingDots from '../generic/ratingDots.jsx'
import * as calc from '../../utils/calculated/'

export function FullSpecialtyBlock(props) {
  const character = props.character
  const specialties = character.specialties

  const spec = specialties.map((s) =>
    <div key={s.ability + s.context}>
      <span className="specialtyAbility">
        { s.ability }
      </span>
      <span className="specialtyContext">
        { s.context }
      </span>
      <Divider />
    </div>
  );

  return(<div className="fullSpecialtyBlock">
    <h3>Specialties<SpecialtyPopup character={ character } /></h3>
    { spec }
  </div>);
}

export function MeritSummary(props) {
  const merits = props.merits.map((merit) =>
    <div key={merit.id}>
      { merit.name }
      { merit.name.toUpperCase() != merit.merit_name.toUpperCase() &&
        <span> ({ merit.merit_name })</span>
      }
      <RatingDots rating={merit.rating} dontFill />
      <Divider />
    </div>
  );

  return(<div className="meritSummaryBlock">
    <h3>
      <Link to={"/characters/" + props.character.id + "/merits"}>Merits</Link>
      {/*<AllMeritsPopup character={ props.character } merits={ props.merits } /> */}
    </h3>

    { merits}
  </div>);
}

export function IntimacySummary(props) {
  const principles = props.character.principles.map((p, index) =>
    <div className="intimacyListItem" key={index}>
      { p.subject }
      <RatingDots rating={ p.rating } fillTo={ 3 } />
      <Divider />
    </div>
  )
  const ties = props.character.ties.map((p, index) =>
    <div className="intimacyListItem" key={index}>
      { p.subject }
      <RatingDots rating={ p.rating } fillTo={ 3 } />
      <Divider />
    </div>
  )

  return(<div className="intimacySummaryBlock">
    <h3>Intimacies<IntimacyPopup character={ props.character } /></h3>
    <div>
      <h5>Principles</h5>
      { principles }
    </div>
    <div>
      <h5>Ties</h5>
      { ties }
    </div>

  </div>);
}

export function WillpowerBlock(props) {
  const { character } = props

  return(<div className="willpowerBlock">
    <h3>Willpower<WillpowerPopup character={ character } /></h3>
    <div className="current">
      Current: <RatingDots rating={ character.willpower_temporary } fillTo={10} />
    </div>
    <div className="permanent">
      Permanent: <RatingDots rating={ character.willpower_permanent } fillTo={10} />
    </div>
    <Divider />
  </div>)
}

export class CharacterSheet extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { character, weapons, merits } = this.props

    // Don't render the display without a character
    if (character == undefined)
      return(<h1>Lot-Casting Atemi</h1>)

    return (
      <div className="characterSheet">

        <h1 className="name">{character.name}<BasicsEditorPopup character={ character } /></h1>

        <FullAbilityBlock character={ character } />
        <FullAttributeBlock character={ character } />

        <FullSpecialtyBlock character={ character } />
        <MeritSummary character={ character } merits={ merits } />

        <WeaponSummary character={ character } weapons={ weapons } />

        <hr className="clear4" />

        <CombatBlock character={ character } weapons={ weapons } merits={ merits } />
        <HealthLevelBlock character={ character } />
        <WillpowerBlock character={ character } />

        <hr className="clear4" />

        <ArmorSummary character={ character } />

        <SocialBlock character={ character } />
        <IntimacySummary character={ character } />

      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const character = state.entities.characters[ownProps.match.params.characterId]
  let weapons = []
  let merits = []

  if (character != undefined && character.weapons != undefined) {
    weapons = character.weapons.map((id) => state.entities.weapons[id])
  }
  if (character != undefined && character.weapons != undefined) {
    merits = character.merits.map((id) => state.entities.merits[id])
  }

  const { isFetching, isError } = state.app
  return {
    character,
    weapons,
    merits,
    isFetching,
    isError
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateChar: (id, trait, value) => {
      dispatch(updateCharacter(id, trait, value))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CharacterSheet)
