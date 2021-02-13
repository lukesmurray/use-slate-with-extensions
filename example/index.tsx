import * as React from 'react';
import 'react-app-polyfill/ie11';
import * as ReactDOM from 'react-dom';
import { Default as Controlled } from '../stories/Controlled.stories';
import { Default as Highlights } from '../stories/Highlights.stories';
import { Default as LogOperations } from '../stories/LogOperations.stories';
import { Default as Mentions } from '../stories/Mentions.stories';
import { Default as MentionsAndHighlights } from '../stories/MentionsAndHighlights.stories';
import { Default as Uncontrolled } from '../stories/Uncontrolled.stories';
import './style.css';

const App = () => {
  return (
    <div id="app">
      <h1>UseSlateWithExtensions</h1>
      <h2>Uncontrolled</h2>
      <Uncontrolled />
      <h2>Controlled</h2>
      <Controlled />
      <h2>Mentions</h2>
      <Mentions />
      <h2>Highlights</h2>
      <Highlights />
      <h2>Mentions and Highlights</h2>
      <MentionsAndHighlights />
      <h2>Log Operations</h2>
      <LogOperations />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
