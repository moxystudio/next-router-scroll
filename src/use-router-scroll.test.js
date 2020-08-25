import React, { useContext } from 'react';
import { render } from '@testing-library/react';
import RouterScrollContext from './context';
import RouterScrollProvider from './RouterScrollProvider';
import useRouterScroll from './use-router-scroll';

it('should return the provider value', () => {
    expect.assertions(1);

    const MyComponent = () => {
        const providerValue = useContext(RouterScrollContext);
        const routerScroll = useRouterScroll();

        expect(routerScroll).toBe(providerValue);

        return null;
    };

    render(
        <RouterScrollProvider>
            <MyComponent />
        </RouterScrollProvider>,
    );
});
