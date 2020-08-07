/* eslint-disable react/prop-types */
import React, { useEffect, useCallback, useRef } from 'react';
import PageSwapper from '@moxy/react-page-swapper';
import getScrollBehavior from '@moxy/next-scroll-behavior';
import PageTransition from '../shared/modules/react-page-transition';

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
            node={ <Component { ...pageProps } /> }>
            { (props) => <PageTransition { ...props } /> }
        </PageSwapper>
    );
};

export default App;
