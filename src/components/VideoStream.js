import React from 'react';
import Image from 'react-bootstrap/Image'


export default class VideoStream extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h2>Live Feed</h2>
        <Image src="http://localhost:5000/api/video_feed" fluid />
      </React.Fragment>
    )
  }
}