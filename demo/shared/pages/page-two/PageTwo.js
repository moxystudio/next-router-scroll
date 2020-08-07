import React from 'react';
import PageLinks from '../../modules/page-links';

import styles from './PageTwo.module.css';

const PageTwo = () => (
    <div className={ styles.pageTwo }>
        <h1>Page 2</h1>
        <PageLinks />
        <h2>100vh</h2>
        <h2>300vh</h2>
        <h2>400vh</h2>
    </div>
);

export default PageTwo;
