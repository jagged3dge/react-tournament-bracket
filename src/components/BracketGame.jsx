import React, { PropTypes, PureComponent } from 'react';
import { RectClipped } from './Clipped';
import GameShape, { HOME, VISITOR } from './GameShape';
import controllable from 'react-controllables';

class BracketGame extends PureComponent {
  static propTypes = {
    game: GameShape.isRequired,

    hoveredTeamId: PropTypes.string,
    onHoveredTeamIdChange: PropTypes.func.isRequired,

    style: PropTypes.shape(
      {
        backgroundColor: PropTypes.string.isRequired,
        hoverBackgroundColor: PropTypes.string.isRequired,
        scoreBackground: PropTypes.string.isRequired,
        winningScoreBackground: PropTypes.string.isRequired,
        teamNameStyle: PropTypes.object.isRequired,
        teamScoreStyle: PropTypes.object.isRequired,
        gameNameStyle: PropTypes.object.isRequired,
        teamSeparatorStyle: PropTypes.object.isRequired
      }
    )
  };

  static defaultProps = {
    hoveredTeamId: null,

    style: {
      backgroundColor: '#58595e',
      hoverBackgroundColor: '#222',

      scoreBackground: '#787a80',
      winningScoreBackground: '#ff7324',
      teamNameStyle: { fill: '#fff', fontSize: 12, textShadow: '1px 1px 1px #222' },
      teamScoreStyle: { fill: '#23252d', fontSize: 12 },
      gameNameStyle: { fill: '#999', fontSize: 10 },
      teamSeparatorStyle: { stroke: '#444549', strokeWidth: 1 }
    }
  };

  render() {
    const {
      game,

      hoveredTeamId,
      onHoveredTeamIdChange,

      style: {
        backgroundColor,
        hoverBackgroundColor,
        scoreBackground,
        winningScoreBackground,
        teamNameStyle,
        teamScoreStyle,
        gameNameStyle,
        teamSeparatorStyle
      },
      ...rest
    } = this.props;

    const { name, sides: bySide } = game;

    const home = bySide[ HOME ],
      visitor = bySide[ VISITOR ];

    const winnerBackground = (home && visitor && home.score && visitor.score && home.score.score !== visitor.score.score) ?
      (
        home.score.score > visitor.score.score ?
          <rect x="170" y="0" width="30" height="22.5" style={{ fill: winningScoreBackground }} rx="3" ry="3"/> :
          <rect x="170" y="22.5" width="30" height="22.5" style={{ fill: winningScoreBackground }} rx="3" ry="3"/>
      ) :
      null;

    const Side = ({ x, y, side, onHover }) => {
      const tooltip = side.seed && side.team ? <title>{side.seed.displayName}</title> : null;

      return (
        <g onMouseEnter={() => onHover(side && side.team ? side.team.id : null)} onMouseLeave={() => onHover(null)}>
          {/* trigger mouse events on the entire block */}
          <rect x={x} y={y} height={22.5} width={200} fillOpacity={0}>
            {tooltip}
          </rect>

          <RectClipped x={x} y={y} height={22.5} width={165}>
            <text x={x + 5} y={y + 16}
                  style={{ ...teamNameStyle, fontStyle: side.seed && side.seed.sourcePool ? 'italic' : null }}>
              {tooltip}
              {side.team ? side.team.name : (side.seed ? side.seed.displayName : null)}
            </text>
          </RectClipped>

          <text x={x + 185} y={y + 16} style={teamScoreStyle} textAnchor="middle">
            {side.score ? side.score.score : null}
          </text>
        </g>
      );
    };

    const homeHovered = (home && home.team && home.team.id === hoveredTeamId),
      visitorHovered = (visitor && visitor.team && visitor.team.id === hoveredTeamId);

    return (
      <svg width="200" height="68" {...rest} viewBox="0 0 200 68">
        {/* backgrounds */}

        {/* base background */}
        <rect x="0" y="0" width="200" height="45" fill={backgroundColor} rx="3" ry="3"/>

        {/* background for the home team */}
        <rect x="0" y="0" width="200" height="22.5" fill={homeHovered ? hoverBackgroundColor : backgroundColor} rx="3"
              ry="3"/>
        {/* background for the visitor team */}
        <rect x="0" y="22.5" width="200" height="22.5" fill={visitorHovered ? hoverBackgroundColor : backgroundColor}
              rx="3" ry="3"/>

        {/* scores background */}
        <rect x="170" y="0" width="30" height="45" fill={scoreBackground} rx="3" ry="3"/>

        {/* winner background */}
        {winnerBackground}

        {/* the players */}
        {
          home ? (
              <Side x={0} y={0} side={home} onHover={onHoveredTeamIdChange}/>
            ) : null
        }

        {
          visitor ? (
              <Side x={0} y={22.5} side={visitor} onHover={onHoveredTeamIdChange}/>
            ) : null
        }

        <line x1="0" y1="22.5" x2="200" y2="22.5" style={teamSeparatorStyle}/>

        {/* game name */}
        <text x="100" y="56" textAnchor="middle" style={gameNameStyle}>
          {name}
        </text>
      </svg>
    );
  }
}

export default controllable(BracketGame, [ 'hoveredTeamId' ]);