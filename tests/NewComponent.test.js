import React from 'react';
import { render } from '@testing-library/react';
import NewComponent from '../src/NewComponent';

const defaultProps = {
    children: <span>Hello</span>,
};

const renderWithProps = (props = {}) => render(<NewComponent { ...defaultProps } { ...props } />);

describe('NewComponent Component', () => {
    it('should render correctly', () => {
        const { getByText } = renderWithProps();

        expect(getByText('Hello')).toBeInTheDocument();
    });

    it('should render correctly with different children', () => {
        const { asFragment } = renderWithProps({
            children: <span>Foo Bar</span>,
        });

        expect(asFragment()).toMatchSnapshot();
    });
});
