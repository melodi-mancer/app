import React from 'react'

export default class analysis extends React.Component {

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
      const headings = ["RC1", "RC2", "RC3", "new_RC1", "new_RC2", "new_RC3", "_row"];
      return (
        <table class="stats-table">
          <thead>
            <tr>
              {headings.map(heading => {
                return <th key={heading}>{heading}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {this.props.data.profile_cfa.map((row, index) => {
              return <tr key={index}>
                {headings.map((key, index) => {
                  return <td key={row[key]}>{row[key]}</td>
                })}
              </tr>;
            })}
          </tbody>
        </table>
      )
    }
    else {
      return ("")
    }
  }
}
