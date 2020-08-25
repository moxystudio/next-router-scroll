import React, { Component, createRef, useContext } from 'react';
import { render } from '@testing-library/react';
import RouterScrollContext from './context';
import ScrollBehaviorProvider from './RouterScrollProvider';
import withRouterScroll from './with-router-scroll';

it('should inject routerScroll prop', () => {
    expect.assertions(1);

    const MyComponent = withRouterScroll(({ routerScroll }) => {
        const providerValue = useContext(RouterScrollContext);

        expect(routerScroll).toBe(providerValue);

        return null;
    });

    render(
        <ScrollBehaviorProvider>
            <MyComponent />
        </ScrollBehaviorProvider>,
    );
});

it('should forward refs', () => {
    class MyComponent extends Component {
        render() {
            return null;
        }

        handleClick = () => {};
    }

    const EnhancedMyComponent = withRouterScroll(MyComponent);

    const ref = createRef();

    render(
        <ScrollBehaviorProvider>
            <EnhancedMyComponent ref={ ref } />
        </ScrollBehaviorProvider>,
    );

    expect(ref.current.handleClick).toBeDefined();
});

it('should copy statics', () => {
    const MyComponent = () => {};

    MyComponent.foo = 'bar';

    const EnhancedMyComponent = withRouterScroll(MyComponent);

    expect(EnhancedMyComponent.foo).toBe('bar');
});
