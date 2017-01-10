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
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  // This is overkill for demo purposes, but it is entirely plausible that
  // evaluation take a long time. As such, it should be asynch.
  _evalPromiseConstructor(input) {
    let { pushHistory, setPrompt, history } = this.props;
    var handler = (result) => {
      pushHistory(result);
      setPrompt('');
      this.setState({
        cursorPos: 0,
        historyPos: history.length + 1
      });

      var term = document.getElementById("console-terminal");
      term.scrollTop = term.scrollHeight - term.clientHeight;

    };
    var evalPromise = new Promise((resolve, reject) => {
      let result;
      try {
        result = this.props.evalFn(input);
        switch (result) {
          case undefined:
            result = "undefined";
            break;
          case null:
            result = "null";
            break;
        }
        resolve({ type: "stdout", input, output: result });
      } catch(err) {
        reject({ type: "stderr", input, output: `${err.name}: ${err.message}`});
      }
    });
    return evalPromise.then(handler, handler);
  }

  _handleKeyDown(e) {
    let { setPrompt, prompt, history } = this.props;
    let {cursorPos, historyPos } = this.state;
    let newHistoryPos = historyPos;
    switch (e.key) {
      // Handle ignored keypresses first.
      case "Shift":
      case "Alt":
      case "Meta":
      case "CapsLock":
      case "Control":
      case "Escape":
      break;

      case "ArrowLeft":
        e.preventDefault();
        this.setState({
          cursorPos: Math.max(0, cursorPos - 1)
        });
        break;

      case "ArrowRight":
        e.preventDefault();
        this.setState({
          cursorPos: Math.min(cursorPos + 1, prompt.length)
        });
        break;

      case "ArrowUp":
        e.preventDefault();
        newHistoryPos = Math.max(0, historyPos - 1);
        this.setState({
          cursorPos: history[newHistoryPos].input.length,
          historyPos: newHistoryPos
        });
        setPrompt((newHistoryPos >= 0) ? history[newHistoryPos].input : '');
        break;

      case "ArrowDown":
        e.preventDefault();
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

      case "Delete":
        prompt = prompt.slice(0,cursorPos) + prompt.slice(cursorPos+1);
        setPrompt(prompt);
        break;

      case "Backspace":
        if (!prompt) {
          break;
        }
        prompt = prompt.slice(0,cursorPos - 1) + prompt.slice(cursorPos);
        setPrompt(prompt);
        this.setState({ cursorPos: cursorPos - 1 });
        break;

      case "Enter":
        this._evalPromiseConstructor(prompt);
        e.preventDefault();
        break;

      default:
        console.log(e.key);
        if (e.key === " ") {
          e.preventDefault();
        }
        if (e.ctrlKey) {
          if ('qQwWrRtT'.indexOf(e.key) < 0) {
            e.preventDefault();
          }
          //TODO: Handle other control sequences.
          break;
        }

        prompt = prompt.slice(0,cursorPos) + e.key + prompt.slice(cursorPos);
        setPrompt(prompt);
        this.setState({ cursorPos: cursorPos + 1 });
    }
  }

  _renderPrompt() {
    let { cursorPos, historyPos } = this.state;
    let { history, prompt } = this.props;
    if (prompt) {
      return (
        <span className="console-prompt">
          {"> "}
          {prompt.slice(0, cursorPos)}
          <span className="console-cursor">{prompt[cursorPos] || " "}</span>
          {prompt.slice(cursorPos+1) || ''}
        </span>
      );
    }
    // I tried to get the cursor rendering with pseudocontent like I did
    // above, but it shifted the prompt over.
    return <span className="console-prompt">> <span className="console-cursor-empty"> </span></span>;
  }

  _renderHistory() {
    let { history } = this.props;
    let historyList = [];
    history.forEach((lineItem, idx) => {
      historyList.push(
        <li key={`in-${idx}`} className={"history-input"}>
          {"> " + lineItem.input}
        </li>
      );
      historyList.push(
        <li key={`out-${idx}`} className={lineItem.type}>
          {lineItem.output.toString()}
        </li>
      );
    });
    return (
      <ul className="console-history">
        {historyList}
      </ul>
    );
  }

  // TIL: tabIndex="0" makes an element focusable.
  // TODO: Make it a form instead.
  render () {
    return (
      <div className="console-component" id="console-terminal"
           onKeyDown={this._handleKeyDown}
           tabIndex="0" autoFocus>
        {this._renderHistory()}
        {this._renderPrompt()}
      </div>
    );
  }
}

export default ConsoleComponent;
