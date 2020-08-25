/* eslint-disable react/prop-types */
import React from 'react';
import PageSwapper from '@moxy/react-page-swapper';
import { RouterScrollProvider, useRouterScroll } from '@moxy/next-router-scroll';
import PageTransition from '../components/page-transition';

const AppInner = ({ Component, pageProps }) => {
    const { updateScroll } = useRouterScroll();

    return (
        <PageSwapper
            updateScroll={ updateScroll }
            node={ <Component { ...pageProps } /> }>
            { (props) => <PageTransition { ...props } /> }
        </PageSwapper>
    );
};

const App = (props) => (
    <RouterScrollProvider>
        <AppInner { ...props } />
    </RouterScrollProvider>
);

export default App;
