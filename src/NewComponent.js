import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const NewComponent = ({ children, className }) => (
    <div className={ classNames('next-lib-template_container', className) }>
        { children }
    </div>
);

NewComponent.propTypes = {
    children: PropTypes.any.isRequired,
    className: PropTypes.string,
};

export default NewComponent;
