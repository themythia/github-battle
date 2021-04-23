import React from 'react';
import { battle } from '../utils/api';
import {
  FaCompass,
  FaBriefcase,
  FaUsers,
  FaUserFriends,
  FaCode,
  FaUser,
} from 'react-icons/fa';
import Card from './Card';
import PropTypes from 'prop-types';
import Loading from './Loading';

class ProfileList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoveringLocation: false,
      hoveringCompany: false,
    };
    this.mouseOut = this.mouseOut.bind(this);
    this.mouseOver = this.mouseOver.bind(this);
  }

  mouseOver(id) {
    this.setState({
      [id]: true,
    });
  }
  mouseOut(id) {
    this.setState({
      [id]: false,
    });
  }

  render() {
    const { profile } = this.props;
    const { hoveringLocation, hoveringCompany } = this.state;

    return (
      <ul className='card-list'>
        <li>
          <FaUser color='rgb(239, 115, 115)' size={22} />
          {profile.name}
        </li>
        {profile.location && (
          <li
            onMouseOver={() => this.mouseOver('hoveringLocation')}
            onMouseOut={() => this.mouseOut('hoveringLocation')}
            className='tooltip-container'
          >
            {hoveringLocation === true && (
              <div className='tooltip'>User's Location</div>
            )}
            <FaCompass color='rgb(144, 115, 255)' size={22} />
            {profile.location}
          </li>
        )}
        {profile.company && (
          <li
            onMouseOver={() => this.mouseOver('hoveringCompany')}
            onMouseOut={() => this.mouseOut('hoveringCompany')}
            className='tooltip-container'
          >
            {hoveringCompany === true && (
              <div className='tooltip'>User's Company</div>
            )}
            <FaBriefcase color='#795548' size={22} />
            {profile.company}
          </li>
        )}
        <li>
          <FaUsers color='rgb(129, 195, 245)' size={22} />
          {profile.followers.toLocaleString()} followers
        </li>
        <li>
          <FaUserFriends color='rgb(64, 183, 95)' size={22} />
          {profile.following.toLocaleString()} following
        </li>
        <li>
          <FaCode color='rgb(59, 76, 85)' size={22} />
          {profile.public_repos.toLocaleString()} public repos
        </li>
      </ul>
    );
  }
}

ProfileList.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      winner: null,
      loser: null,
      error: null,
      loading: true,
    };
  }
  componentDidMount() {
    const { playerOne, playerTwo, onReset } = this.props;
    battle([playerOne, playerTwo])
      .then((players) => {
        this.setState({
          winner: players[0],
          loser: players[1],
          error: null,
          loading: false,
        });
      })
      .catch(({ message }) => {
        this.setState({
          error: message,
          loading: false,
        });
      });
  }
  render() {
    const { winner, loser, error, loading } = this.state;

    if (loading === true) {
      return <Loading text='Battling' />;
    }

    if (error) {
      return <p className='center-text error'>{error}</p>;
    }

    return (
      <React.Fragment>
        <div className='grid space-around container-sm'>
          <Card
            header={winner.score === loser.score ? 'Tie' : 'Winner'}
            subheader={`Score: ${winner.score.toLocaleString()}`}
            avatar={winner.profile.avatar_url}
            href={winner.profile.html_url}
            name={winner.profile.login}
          >
            <ProfileList profile={winner.profile} />
          </Card>
          <Card
            header={winner.score === loser.score ? 'Tie' : 'Loser'}
            subheader={`Score: ${loser.score.toLocaleString()}`}
            avatar={loser.profile.avatar_url}
            href={loser.profile.html_url}
            name={loser.profile.login}
          >
            <ProfileList profile={loser.profile} />
          </Card>
        </div>
        <button onClick={this.props.onReset} className='btn dark-btn btn-space'>
          Reset
        </button>
      </React.Fragment>
    );
  }
}

Results.propTypes = {
  playerOne: PropTypes.string.isRequired,
  playerTwo: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
};
