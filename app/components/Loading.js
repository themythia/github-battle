import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({ text = 'Loading', speed = 300 }) => {
  const [content, setContent] = React.useState(text);
  React.useEffect(() => {
    const id = window.setInterval(() => {
      setContent((content) => {
        return content === `${text}...` ? text : `${content}.`;
      });
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);
  return <p className='loading'>{content}</p>;
};
export default Loading;

Loading.propTypes = {
  text: PropTypes.string,
  speed: PropTypes.number,
};
