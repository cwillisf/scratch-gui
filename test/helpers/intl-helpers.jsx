/*
 * Helpers for using enzyme and react-test-renderer with react-intl
 */
import React from 'react';
import renderer from 'react-test-renderer';
import {createIntl, IntlProvider} from 'react-intl';
import {mount, shallow} from 'enzyme';
import intlShape from '../../src/lib/intl-shape';

/**
 * @type {import('react-intl').IntlConfig}
 */
const defaultIntlConfig = Object.freeze({
    locale: 'en',
    messages: {},
    textComponent: 'span'
});

const shallowWithIntl = (node, {context} = {}) => {
    //const intl = createIntl(defaultIntlConfig);
    return shallow(
        node, // React.cloneElement(node, {intl}),
        {
            context: Object.assign({}, context), //, {intl})
            wrappingComponent: IntlProvider,
            wrappingComponentProps: defaultIntlConfig
        }
    ).dive();
    // Why is dive() needed here? Is this due to a change (bug?) in the unofficial enzyme adapter?
};

const mountWithIntl = (node, {context, childContextTypes} = {}) => {
    const intl = createIntl(defaultIntlConfig);
    return mount(
        node, // React.cloneElement(node, {intl}),
        {
            context: Object.assign({}, context, {intl}),
            childContextTypes: Object.assign({}, {intl: intlShape}, childContextTypes),
            wrappingComponent: IntlProvider,
            wrappingComponentProps: defaultIntlConfig
        }
    );
};

// react-test-renderer component for use with snapshot testing
const componentWithIntl = (children, props = {}) =>
    renderer.create(
        <IntlProvider
            {...defaultIntlConfig}
            {...props}
        >
            {children}
        </IntlProvider>
    );

export {
    componentWithIntl,
    shallowWithIntl,
    mountWithIntl
};
