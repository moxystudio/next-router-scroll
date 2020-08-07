import React from 'react';
import PageLinks from '../../modules/page-links';

import styles from './Home.module.css';

const Home = () => (
    <div className={ styles.home }>
        <h1>Home</h1>
        <PageLinks />
        <h2>100vh</h2>
        <h2>200vh</h2>
        <h2>300vh</h2>
    </div>
);

export default Home;
