// @flow
import type { Character } from 'utils/flow-types'

export function hardness(character: Character) {
  let armor = 0
  let b = 0
  let altTotal = 0
  let bonus = []
  const bonfire = character.anima_level === 3

  if (character.armor_is_artifact) {
    switch (character.armor_weight) {
      case 'light':
        armor = 4
        break
      case 'medium':
        armor = 7
        break
      case 'heavy':
        armor = 10
    }
  }

  if (character.type !== 'Character') {
    // Twilight caste anima power grants 5 hardness at Bonfire/Iconic
    if (
      (character.type === 'SolarCharacter' ||
        character.exalt_type.toLowerCase() === 'solar') &&
      character.caste.toLowerCase() === 'twilight'
    ) {
      if (bonfire) {
        altTotal = 5
        bonus = bonus.concat([{ label: '5 anima' }])
      } else {
        bonus = bonus.concat([{ label: '5/5m anima', situational: true }])
      }
    }

    if (
      character.type === 'DragonbloodCharacter' ||
      character.exalt_type.toLowerCase().startsWith('dragon')
    ) {
      switch (character.caste.toLowerCase()) {
        // Earth aspects get +1 hardness for 3m, or free at Bonfire
        case 'earth':
          if (bonfire) {
            b += 1
            bonus = bonus.concat([{ label: 'anima', bonus: 1 }])
          } else
            bonus = bonus.concat([
              { label: '/3m anima', bonus: 1, situational: true },
            ])
          break

        // Fire aspects get +2 hardness vs heat for 5m, or free at Bonfire
        case 'fire':
          bonus = bonus.concat([
            { label: `${bonfire ? '2' : '2/5m'} vs heat`, situational: true },
          ])
          break
      }
    }
  }

  return {
    name: 'Hardness',
    armored: armor,
    bonus: bonus,
    total: Math.max(armor + b, altTotal),
  }
}
export default hardness