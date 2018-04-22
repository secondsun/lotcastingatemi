// @flow
import { attr } from '../..'
import { weaponOverwhelming } from '../../weapons'
import type { Character, fullWeapon } from 'utils/flow-types'

function weaponDamageBonus(weapon: fullWeapon) {
  if (weapon.tags.includes('subtle')) return 0

  let damage = 0

  switch (weapon.weight) {
    case 'medium':
      damage = 9
      break
    case 'heavy':
      damage = 11
      break
    case 'light':
    default:
      damage = 7
      break
  }

  if (weapon.is_artifact) damage += 3

  return damage
}

export function witheringDamage(character: Character, weapon: fullWeapon) {
  const damage = weaponDamageBonus(weapon)
  const powDamage = weaponDamageBonus({ ...weapon, weight: 'heavy' })
  let _attr = weapon.damage_attr
  let attrRating = attr(character, _attr)

  let bonus = []
  let b = 0

  if (weapon.tags.includes('subtle')) {
    bonus = bonus.concat([{ label: 'subtle' }])
    _attr = 'subtle'
    attrRating = 0
  } else if (weapon.tags.includes('flame')) {
    bonus = bonus.concat([{ label: 'flame', noFull: true }])
    _attr = 'flame'
    attrRating = 4
  } else if (weapon.tags.includes('crossbow')) {
    bonus = bonus.concat([{ label: 'crossbow', noFull: true }])
    _attr = 'crossbow'
    attrRating = 4
  } else if (weapon.tags.includes('firearm')) {
    bonus = bonus.concat([{ label: 'firearm', noFull: true }])
    _attr = 'firearm'
    attrRating = 4
  }
  if (weapon.tags.includes('shield')) {
    bonus = bonus.concat([{ label: 'shield', bonus: -2 }])
    b -= 2
  }

  return {
    name: weapon.name + ' Withering Damage',
    attribute: _attr,
    attributeRating: attrRating,
    weaponDamage: damage,
    powerfulDamage: weapon.tags.includes('powerful') ? powDamage : undefined,
    raw: attrRating + damage,
    totalPenalty: -b,
    total: attrRating + damage + b,
    minimum: weaponOverwhelming(character, weapon),
    specialAttacks: weapon.tags.includes('poisonable') ? ['poisonable'] : [],
    bonus: bonus,
  }
}