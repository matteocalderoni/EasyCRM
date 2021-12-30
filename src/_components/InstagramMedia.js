import React, { Component } from "react";

class InstagramMedia extends Component {
  render() {
    return (
      <a href={this.props.url} rel="noreferrer" target="_blank">
        <img src={this.props.src} alt={this.props.alt}></img>
      </a>
    );
  }
}

export default InstagramMedia;