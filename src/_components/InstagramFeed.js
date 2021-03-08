import React, { Component } from "react";
import Instagram from '../_helpers/instagram';
import InstagramMedia from "./InstagramMedia";

class InstagramFeed extends Component {
  static defaultProps = {
    className: "",
    classNameLoading: "",
    getFeedFn: Instagram.getFeed,
    limit: 12,
  };

  constructor(props) {
    super(props);

    this.state = { loading: true, media: [] };
  }

  componentDidMount() {
    this.props
      .getFeedFn(this.props.userName)
      .then((media) =>
        this.setState({
          loading: false,
          media: media.slice(0, this.props.limit),
        })
      )
      .catch((error) => this.setState({ error }));
  }

  render() {
    if (this.state.error) throw this.state.error;

    const className = this.state.loading
      ? [this.props.className, this.props.classNameLoading].join(" ")
      : this.props.className;

    return (
      <div className={className}>
        {this.state.media.map((media, index) => (
          <InstagramMedia key={index} src={media.src} url={media.url} alt={media.alt} />
        ))}
      </div>
    );
  }
}

export { InstagramFeed };