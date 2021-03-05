import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import Modal from '../../containers/modal.jsx';
import {connect} from 'react-redux';

import Box from '../box/box.jsx';
import {closeAboutModal} from '../../reducers/modals';

import scratchLogo from '../../lib/assets/scratch-logo.svg';

import styles from './about-modal.css';


const messages = defineMessages({
    title: {
        id: 'gui.aboutModal.title',
        defaultMessage: 'About {prodName}',
        description: 'Title text for the "About" modal dialog, where "{prodName}" will be replaced like "About Scratch"'
    },
    versionLabel: {
        id: 'gui.aboutModal.versionLabel',
        defaultMessage: '{prodName} version {prodVer}',
        description: 'Label for version, where "{prodName}" and "{prodVer}" will be replaced like "Scratch version 1.2.3"'
    }
});

const AboutModal = props => {
    const productInfo = (typeof props.productInfo === 'function' ? props.productInfo() : props.productInfo);
    const productMessageVariables = {
        prodName: productInfo.productName,
        prodVer: productInfo.productVersion
    };
    return (<Modal
        id="aboutModal"
        className={styles.modalContent}
        contentLabel={props.intl.formatMessage(messages.title, productMessageVariables)}
        onRequestClose={props.onRequestClose}
    >
        {/* <div dir={this.props.isRtl ? 'rtl' : 'ltr'} > */}
        <Box className={styles.body}>
            <img
                src={productInfo.productLogo || scratchLogo}
                className={styles.logo}
            />
            <Box className={styles.versionMain}>
                {props.intl.formatMessage(messages.versionLabel, productMessageVariables)}
            </Box>
            <Box className={styles.versionDetails}>
                {
                    productInfo.componentVersions && productInfo.componentVersions.map(({name, version}) =>
                            <div key={name} className={styles.versionComponent}>{name} {version}</div>
                        )
                }
            </Box>
        </Box>
    </Modal>);
};

AboutModal.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func, // provided by mapDispatchToProps

    productInfo: PropTypes.oneOfType([
        // function returning an object matching the shape below
        PropTypes.func,

        // an object which contains product info
        PropTypes.shape({
            productLogo: PropTypes.string.isRequired, // logo image URI
            productName: PropTypes.string, // omit this if it would be redundant after the logo
            productVersion: PropTypes.string.isRequired, // "3.19.2" or "1.2.3+foo" or anything really

            // Optional array of component version info:
            componentVersions: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string.isRequired, // "Electron", "Node", "React", etc.
                    version: PropTypes.string.isRequired
                })
            )
        })
    ])
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    onRequestClose: () => dispatch(closeAboutModal())
});

const ConnectedAboutModal = injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(AboutModal));

export default ConnectedAboutModal;
