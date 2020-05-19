import React from 'react';
import NewComponent from '@moxy/react-lib-template';

import styles from './index.module.css';

const Home = () => (
    <div className={ styles.home }>
        <h1>react-lib-template</h1>
        <NewComponent className={ styles.newComponent }>Hello World</NewComponent>
    </div>
);

export default Home;
