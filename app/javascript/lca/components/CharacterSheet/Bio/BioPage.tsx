import * as React from 'react'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import { RouteComponentProps as RouteProps } from 'react-router'
import { compose } from 'recompose'

import { Grid, Typography } from '@material-ui/core'
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles'

import BlockPaper from 'components/generic/blockPaper.jsx'
import MarkdownDisplay from 'components/generic/MarkdownDisplay.jsx'
import ProtectedComponent from 'containers/ProtectedComponent.jsx'
import { State } from 'ducks/index.js'
import { getSpecificCharacter } from 'ducks/selectors'
import { Character, XpLogEntry } from 'types'
import { solarXpName, spentSolarXp, spentXp } from 'utils/calculated'
import CharacterLoadError from '../CharacterLoadError'

const styles = (theme: Theme) =>
  createStyles({
    // ...sharedStyles(theme),
    portrait: {
      display: 'block',
      margin: 'auto',
      maxWidth: '100%',
    },
    portraitWrap: {
      // textAlign: 'center',
    },
  })

const xpTable = (log: XpLogEntry[]) =>
  log.map((l, i) => (
    <tr key={`${l.label}_${i}`}>
      <td style={{ textAlign: 'right' }}>{l.points}:</td>
      <td style={{ width: '100%' }}>{l.label}</td>
    </tr>
  ))

interface Props extends WithStyles<typeof styles> {
  character: Character
}

const BioFullPage = ({ character, classes }: Props) => {
  /* Escape hatch */
  if (character == null) {
    return <CharacterLoadError />
  }

  return (
    <>
      <DocumentTitle title={`${character.name} Bio | Lot-Casting Atemi`} />

      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Typography variant="h5">Bio/Misc</Typography>
        </Grid>

        <Grid item xs={12}>
          <BlockPaper>
            <MarkdownDisplay source={character.description} />
          </BlockPaper>
        </Grid>

        <Grid item xs={12} md={6}>
          <BlockPaper>
            {character.type !== 'Character' && (
              <Typography paragraph>
                Iconic Anima: {character.anima_display || 'Not specified'}
              </Typography>
            )}
            <Typography paragraph>
              Lore Background: {character.lore_background || 'Not specified'}
            </Typography>
            <Typography paragraph>
              Native Language: {character.native_language}
            </Typography>
          </BlockPaper>
        </Grid>

        <Grid item xs={12} md={6}>
          <BlockPaper>
            <div className={classes.portraitWrap}>
              <a
                href={character.portrait_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={character.portrait_link}
                  className={classes.portrait}
                />
              </a>
            </div>
          </BlockPaper>
        </Grid>

        <Grid item xs={12}>
          <BlockPaper>
            <Typography variant="subtitle1">
              Inventory/Other Equipment
            </Typography>
            <MarkdownDisplay source={character.equipment || 'None'} />
            <Typography variant="subtitle1">Notes</Typography>
            <MarkdownDisplay source={character.notes} />
          </BlockPaper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <BlockPaper>
            <Typography variant="subtitle1">XP</Typography>
            <Typography component="table">
              <tbody>{xpTable(character.xp_log)}</tbody>
            </Typography>
            <Typography>
              Earned: {character.xp_total}, Spent: {spentXp(character)},
              Remaining: {character.xp_total - spentXp(character)}
            </Typography>
          </BlockPaper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <BlockPaper>
            <Typography variant="subtitle1">
              {solarXpName(character) + ' XP'}
            </Typography>
            <Typography component="table">
              <tbody>{xpTable(character.xp_log_solar)}</tbody>
            </Typography>
            <Typography>
              Earned: {character.xp_solar_total}, Spent:{' '}
              {spentSolarXp(character)}, Remaining:{' '}
              {character.xp_solar_total - spentSolarXp(character)}
            </Typography>
          </BlockPaper>
        </Grid>
      </Grid>
    </>
  )
}

const mapStateToProps = (state: State, { match }: RouteProps<any>) => ({
  character: getSpecificCharacter(state, match.params.characterId),
})

export default compose<Props, RouteProps<any>>(
  ProtectedComponent,
  withStyles(styles),
  connect(mapStateToProps)
)(BioFullPage)
