import React, { forwardRef } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import useRouterScroll from './use-router-scroll';

const withRouterScroll = (WrappedComponent) => {
    const WithRouterScroll = forwardRef((props, ref) => {
        const routerScroll = useRouterScroll();

        return (
            <WrappedComponent ref={ ref } { ...props } routerScroll={ routerScroll } />
        );
    });

    WithRouterScroll.displayName = `withRouterScroll(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    hoistNonReactStatics(WithRouterScroll, WrappedComponent);

    return WithRouterScroll;
};

export default withRouterScroll;
