import PropTypes from 'prop-types';
import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import storage from '../../lib/storage';

class ScratchImage extends React.PureComponent {
    static fakeStaticConstructor () {
        this.currentJobs = 0;
        this.pendingImages = new Set();
        this.maxParallelism = 6;
        this.loadPendingImages = this.loadPendingImages.bind(this);
        this.loadPendingImages2 = this.loadPendingImages2.bind(this);
    }
    static loadPendingImages () {
        if (!this.foo) {
            this.foo = true;
            setTimeout(this.loadPendingImages2, 0);
        }
    }
    static loadPendingImages2 () {
        this.foo = false;
        if (this.currentJobs >= this.maxParallelism) {
            // already busy
            console.log(`ScratchImage busy: ${this.currentJobs}`);
            return;
        }
        console.log(`ScratchImage not busy: ${this.currentJobs}`);

        // Find the first visible image. If there aren't any, find the first non-visible image.
        let nextImage;
        for (const image of this.pendingImages) {
            if (image.isVisible) {
                nextImage = image;
                break;
            } else {
                nextImage = nextImage || image;
            }
        }

        // If we found an image to load:
        // 1) Remove it from the queue
        // 2) Load the image
        // 3) Pump the queue again
        if (nextImage) {
            this.pendingImages.delete(nextImage);
            const imageSource = nextImage.props.imageSource;
            ++this.currentJobs;
            const handler = this.imageWasLoaded.bind(this, nextImage);
            storage
                .load(imageSource.assetType, imageSource.assetId)
                .then(handler);
            this.loadPendingImages();
        }
    }
    static imageWasLoaded (nextImage, asset) {
        const dataURI = asset.encodeDataURI();
        nextImage.setState({imageURI: dataURI});
        --this.currentJobs;
    }

    constructor (props) {
        super(props);
        this.state = {
            imageURI: props.imageSource.uri // might be null if imageSource.assetId is set instead
        };
    }
    componentDidMount () {
        if (this.props.imageSource.assetId) {
            ScratchImage.pendingImages.add(this);
        }
    }
    componentDidUpdate (prevProps) {
        if (this.props.imageSource.assetId) {
            if (this.props.imageSource.assetId !== prevProps.imageSource.assetId) {
                // we're either changing `assetId` or going from `uri` to `assetId`
                // if we had an old `assetId`, the load might or might not have finished by now
                ScratchImage.pendingImages.add(this); // this might be redundant but that's OK since it's a `Set`
                ScratchImage.loadPendingImages(); // pump the queue in case it's idle
            }
        } else { // imageSource.uri must be set

            // remove any pending assetId load we might have in the queue
            ScratchImage.pendingImages.delete(this);

            if (this.props.imageSource.uri !== prevProps.imageSource.uri) {
                // eslint doesn't like setting state in this function
                // the React docs say it's OK as long as it's conditional and doesn't trigger its own condition
                // eslint-disable-next-line react/no-did-update-set-state
                this.setState({imageURI: this.props.imageSource.uri});
            }
        }
    }
    render () {
        const {
            src: _src,
            imageSource: _imageSource,
            ...imgProps
        } = this.props;
        return (
            <VisibilitySensor
                intervalCheck
                scrollCheck
            >
                {
                    ({isVisible}) => {
                        this.isVisible = isVisible;
                        if (isVisible) {
                            ScratchImage.loadPendingImages();
                        }
                        return (
                            <img
                                src={this.state.imageURI}
                                // the element must have non-zero size for VisibilitySensor to work before image load
                                style={{minWidth: '1px', minHeight: '1px'}}
                                {...imgProps}
                            />
                        );
                    }
                }
            </VisibilitySensor>
        );
    }
}

ScratchImage.propTypes = {
    imageSource: PropTypes.oneOfType([
        PropTypes.shape({
            assetId: PropTypes.string.isRequired,
            assetType: PropTypes.oneOf(Object.values(storage.AssetType)).isRequired
        }),
        PropTypes.shape({
            uri: PropTypes.string.isRequired
        })
    ]).isRequired
};

ScratchImage.fakeStaticConstructor();

export default ScratchImage;
