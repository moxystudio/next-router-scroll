import React from 'react';
import PageLinks from '../components/page-links';

import styles from './async-page.module.css';

const AsyncPage = () => (
    <div className={ styles.asyncPage }>
        <h1>Async Page</h1>
        <PageLinks />
        <h2>100vh</h2>
        <h2>200vh</h2>
        <h2>300vh</h2>
    </div>
);

AsyncPage.getInitialProps = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return { foo: 'bar' };
};

export default AsyncPage;
