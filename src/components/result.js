import React from 'react'
import Tracks from './tracks';
import Functions from './functions';

export default class result extends React.Component {

  constructor() {
    super();
    this.state = {
      loading: true,
    };
    this.selection = [];
  }

  async componentDidMount() {
    this.state.loading = false;
  }

  render() {
    if (this.props.data) {
      return (
        <Tracks data={this.props.data}></Tracks>
      )
    }
    else {
      return (
        <Functions></Functions>
      )
    }
  }
}