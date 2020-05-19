/* eslint-disable react/prop-types */
import '@moxy/react-lib-template/dist/index.css';

import React from 'react';

const App = ({ Component, pageProps }) => (
    <Component { ...pageProps } />
);

export default App;
