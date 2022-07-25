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
import Tooltip from './Tooltip';
import { ThemeConsumer } from '../contexts/theme';
import queryString from 'query-string';
import { Link } from 'react-router-dom';

const ProfileList = ({ profile }) => {
  return (
    <ul className='card-list'>
      {profile.name && (
        <li>
          <FaUser color='rgb(239, 115, 115)' size={22} />
          {profile.name}
        </li>
      )}
      {profile.location && (
        <li>
          <Tooltip text="User's Location">
            <FaCompass color='rgb(144, 115, 255)' size={22} />
            {profile.location}
          </Tooltip>
        </li>
      )}
      {profile.company && (
        <li>
          <Tooltip text="User's Company">
            <FaBriefcase color='#795548' size={22} />
            {profile.company}
          </Tooltip>
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
};

ProfileList.propTypes = {
  profile: PropTypes.object.isRequired,
};

const battleReducer = (state, action) => {
  if (action.type === 'success') {
    return {
      winner: action.winner,
      loser: action.loser,
      error: null,
      loading: false,
    };
  } else if (action.type === 'error') {
    return {
      ...state,
      error: action.message,
      loading: false,
    };
  } else {
    throw new Error("That action type isn't supported");
  }
};

const Results = ({ location }) => {
  const { playerOne, playerTwo } = queryString.parse(location.search);
  const [state, dispatch] = React.useReducer(battleReducer, {
    winner: null,
    loser: null,
    error: null,
    loading: true,
  });

  React.useEffect(() => {
    battle([playerOne, playerTwo])
      .then((players) =>
        dispatch({ type: 'success', winner: players[0], loser: players[1] })
      )
      .catch(({ message }) => dispatch({ type: 'error', message }));
  }, [playerOne, playerTwo]);

  const { winner, loser, error, loading } = state;

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
      <ThemeConsumer>
        {(theme) => (
          <Link
            to='/battle'
            className={`btn btn-space ${
              theme === 'dark' ? 'light-btn' : 'dark-btn'
            }`}
          >
            Reset
          </Link>
        )}
      </ThemeConsumer>
    </React.Fragment>
  );
};
export default Results;
