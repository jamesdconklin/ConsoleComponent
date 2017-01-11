# ConsoleComponent
React component with simple REPL functionality.

[Live Demo](https://jamesdconklin.github.io/ConsoleComponent)

This is a presentational react component for a REPL (Read, Evaluate, Print, Loop) interface, turning an evaluator function, a command history, and a prompt into a terminal-like element. Beyond React libraries, it has no external dependencies.

## Features

ConsoleComponent supports a stripped-down subset of terminal functionality, namely the ability to insert and delete text at a moveable cursor and to cycle through past commands. Actual evaluation of input commands is delegated to the parent component's provided `evalFn`.

## Usage

The ConsoleComponent requires a parent component to manage its state. It takes as props functions `evalFn`, `pushHistory`, and `setPrompt` which it calls to evaluate user input, add commands onto the history list, and write the current prompt, respectively. It also takes as props the current `prompt` and `history`.

Example:

```js
import React from 'react';
import ConsoleComponent from 'ConsoleComponent';

class ConsoleWrapper extends React.Component {

  ...

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
```
