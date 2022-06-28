import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ScriptTag from 'react-script-tag';


const Demo = props => (
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7252630941302629"
     crossorigin="anonymous"></script>
)

const rootElement = document.getElementById("root");

ReactDOM.render(<App />, rootElement);





