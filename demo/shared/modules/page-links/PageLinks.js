import React from 'react';
import Link from 'next/link';

import styles from './PageLinks.module.css';

const PageLinks = () => (
    <div className={ styles.pageLinks }>
        <ul>
            <li>
                <Link href="/">
                    <a>Home</a>
                </Link>
            </li>
            <li>
                <Link href="/page-two">
                    <a>PageTwo</a>
                </Link>
            </li>
        </ul>
    </div>
);

export default PageLinks;
