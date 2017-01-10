import React from 'react';
import Promise from 'promise';

class ConsoleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cursorPos: props.prompt.length,
      historyPos: props.history.length
    };

    this._evalPromiseConstructor = this._evalPromiseConstructor.bind(this);
    this._renderPrompt = this._renderPrompt.bind(this);
    this._renderHistory = this._renderHistory.bind(this);
    this._handleKeyUp = this._handleKeyUp.bind(this);
  }

  // This is overkill for demo purposes, but it is entirely plausible that
  // evaluation take a long time. As such, it should be asynch.
  _evalPromiseConstructor(input) {
    var evalPromise = new Promise((resolve, reject) => {
      let result;
      try {
        result = this.props.evalFn(input);
        resolve({ type: "stdout", input, output: result });
      } catch(err) {
        reject({ type: "stderr", input, output: '${err.name}: ${err.message}'});
      }
    });
    return evalPromise.then(
      this.props.pushHistory,
      this.props.pushHistory
    );
  }

  _handleKeyUp(e) {
    let { setPrompt, prompt, history } = this.props;
    let {cursorPos, historyPos } = this.state;
    let newHistoryPos = historyPos;
    console.log(e.key);
    switch (e.key) {
      case "ArrowLeft":
        this.setState({
          cursorPos: Math.max(0, cursorPos - 1)
        });
        break;
      case "ArrowRight":
        this.setState({
          cursorPos: Math.min(cursorPos + 1, prompt.length)
        });
        break;
      case "ArrowUp":
        newHistoryPos = Math.max(0, historyPos - 1);
        this.setState({
          cursorPos: history[newHistoryPos].input.length,
          historyPos: newHistoryPos
        });
        setPrompt((newHistoryPos >= 0) ? history[newHistoryPos].input : '');
        break;
      case "ArrowDown":
        newHistoryPos = Math.min(history.length, historyPos + 1);

        if (history[newHistoryPos]) {
          prompt = history[newHistoryPos].input;
          cursorPos = prompt.length;
        } else {
          prompt = '';
          cursorPos = 0;
        }

        setPrompt(prompt);

        this.setState({
          cursorPos,
          historyPos: newHistoryPos
        });
        break;
      default:
        setPrompt("Foooooo");


    }
  }

  _renderPrompt() {
    let { cursorPos, historyPos } = this.state;
    let { history, prompt } = this.props;
    if (prompt) {
      return (
        <span className="console-prompt">
          {prompt.slice(0, cursorPos)}
          <span className="console-cursor">{prompt[cursorPos] || " "}</span>
          {prompt.slice(cursorPos+1) || ''}
        </span>
      );
    }
    return <span className="console-prompt console-prompt-empty"/>;
  }

  _renderHistory() {
    let { history } = this.props;
    return (
      <ul className="console-history">
        {history.map((lineItem, idx) => (
          <li key={idx} className={lineItem.type}>
            {lineItem.output}
          </li>
        ))}
      </ul>
    );
  }

  // TIL: tabIndex="0" makes an element focusable.
  // TODO: Make it a form instead.
  // Note: We're not handling sustained keyDowns for now.
  render () {
    return (
      <div className="console-component"
           onKeyUp={this._handleKeyUp}
           tabIndex="0" autoFocus>
        {this._renderHistory()}
        {this._renderPrompt()}
      </div>
    );
  }
}

export default ConsoleComponent;
