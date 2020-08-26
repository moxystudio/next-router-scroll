import React from 'react';
import PageLinks from '../components/page-links';

import styles from './another-page.module.css';

const AnotherPage = () => (
    <div className={ styles.anotherPage }>
        <h1>Another Page</h1>
        <PageLinks />
        <h2>100vh</h2>
        <h2>300vh</h2>
        <h2>400vh</h2>
    </div>
);

export default AnotherPage;
