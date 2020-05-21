/* eslint-disable react/prop-types */
import React, { useEffect, useCallback, useRef } from 'react';
import PageSwapper from '@moxy/react-page-swapper';
import getScrollBehavior from '@moxy/next-scroll-behavior';
import PageTransition from '../shared/modules/react-page-transition';

import styles from './_app.module.css';

const App = ({ Component, pageProps }) => {
    const scrollBehaviorRef = useRef();

    useEffect(() => {
        scrollBehaviorRef.current = getScrollBehavior();

        return () => {
            scrollBehaviorRef.current.stop();
        };
    }, []);

    const updateScroll = useCallback(() => scrollBehaviorRef.current.updateScroll(), []);

    return (
        <PageSwapper
            updateScroll={ updateScroll }
            className={ styles.pageSwapper }
            node={ <Component { ...pageProps } /> }>
            { (props) => <PageTransition { ...props } /> }
        </PageSwapper>
    );
};

export default App;
