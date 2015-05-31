import React from 'react';
import _ from 'lodash';

class Link extends React.Component
{
    constructor(props) {
        super(props);

        this.handlePushState = this.handlePushState.bind(this);

        if (this.props.onClick !== undefined) {
            throw new Error('Pass click handlers through using `click` prop');
        }
    }

    handlePushState(e) {
        e.preventDefault();
        e.stopPropagation();

        if (typeof this.props.click === 'function') {
            console.log("There should be a click handler here...");
            this.props.click();
        }

        if (typeof window !== 'undefined' && typeof this.props.href !== 'undefined') {
            global.historyLocation.push(this.props.href);
        }
    }

    render() {
        let clonedProps = _.clone(this.props);

        if (clonedProps.href.charAt(0) !== '/') {
            clonedProps.href = '/' + clonedProps.href;
        }

        return (
            <a onClick={this.handlePushState} onTouchEnd={this.handlePushState} {...clonedProps}>
                {this.props.children}
            </a>
        );
    }
}

export default Link;
