import React, { useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import ScrollBehaviorContext from './context';
import NextScrollBehavior from './scroll-behavior';

const Provider = ScrollBehaviorContext.Provider;

const useDisableNextLinkScroll = (disableNextLinkScroll) => {
    useEffect(() => {
        if (!disableNextLinkScroll) {
            return;
        }

        const originalDefaultProps = Link.defaultProps;

        Link.defaultProps = { ...Link.defaultProps, scroll: false };

        return () => {
            Link.defaultProps = originalDefaultProps;
        };
    }, [disableNextLinkScroll]);
};

const useScrollBehavior = (shouldUpdateScroll) => {
    // Create NextScrollBehavior instance once.
    const shouldUpdateScrollRef = useRef();
    const scrollBehaviorRef = useRef();

    shouldUpdateScrollRef.current = shouldUpdateScroll;

    if (!scrollBehaviorRef.current && typeof window !== 'undefined') {
        scrollBehaviorRef.current = new NextScrollBehavior(
            (...args) => shouldUpdateScrollRef.current?.(...args),
        );
    }

    // Destroy NextScrollBehavior instance when unmonting.
    useEffect(() => () => scrollBehaviorRef.current.stop(), []);

    return scrollBehaviorRef.current;
};

const ScrollBehaviorProvider = ({ disableNextLinkScroll, shouldUpdateScroll, children }) => {
    // Disable next <Link> scroll or not.
    useDisableNextLinkScroll(disableNextLinkScroll);

    // Get the scroll behavior, creating it just once.
    const scrollBehavior = useScrollBehavior(shouldUpdateScroll);

    // Create facade to use as the provider value.
    const providerValue = useMemo(() => ({
        updateScroll: scrollBehavior ? scrollBehavior.updateScroll.bind(scrollBehavior) : () => {},
        registerElement: scrollBehavior ? scrollBehavior.registerElement.bind(scrollBehavior) : () => {},
        unregisterElement: scrollBehavior ? scrollBehavior.unregisterElement.bind(scrollBehavior) : () => {},
    }), [scrollBehavior]);

    return (
        <Provider value={ providerValue }>
            { children }
        </Provider>
    );
};

ScrollBehaviorProvider.defaultProps = {
    shouldUpdateScroll: () => true,
    disableNextLinkScroll: true,
};

ScrollBehaviorProvider.propTypes = {
    disableNextLinkScroll: PropTypes.bool,
    shouldUpdateScroll: PropTypes.func,
    children: PropTypes.node,
};

export default ScrollBehaviorProvider;
