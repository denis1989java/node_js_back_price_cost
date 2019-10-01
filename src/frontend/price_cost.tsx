const React = require('react');
const ReactDOM = require('react-dom');

import { Hello } from "./components/Hello";

ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("root")
);