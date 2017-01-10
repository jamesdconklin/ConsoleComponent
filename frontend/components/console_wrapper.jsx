import React from 'react';
import Promise from 'promise';
import ConsoleComponent from 'ConsoleComponent';

class ConsoleWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prompt: 'FooBarBaz',
      history: [
        {type: "test", input: "foo", output: "foo"},
        {type: "test", input: "bar", output: "bar"},
        {type: "test", input: "baz", output: "baz"}
      ]
    };
  }

  setPrompt(prompt) {
    this.setState({ prompt });
  }

  pushHistory({ data, input, output }) {
    this.setState({
      history: this.state.history.concat({ data, input, output })
    });
  }

  evalFn(str) {
    // The following line is for demonstration only.
    return eval(str);
  }

  render () {
    return (
      <ConsoleComponent
        setPrompt={ this.setPrompt.bind(this) }
        evalFn={ this.evalFn.bind(this) }
        pushHistory={ this.pushHistory.bind(this) }
        history={ this.state.history }
        prompt={ this.state.prompt } />
    );
  }
}

export default ConsoleWrapper;
