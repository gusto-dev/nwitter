import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';
import firebaseApp from 'fbase';
console.log(firebaseApp);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
