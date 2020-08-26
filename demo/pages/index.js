import React from 'react';
import PageLinks from '../components/page-links';

import styles from './index.module.css';

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
