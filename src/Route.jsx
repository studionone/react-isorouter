import React from 'react';

class Route extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        let realEle = React.createElement(this.props.handler, this.props);

        return (
            <div>{ realEle }</div>
        );
    }
}

Route.propTypes = {
    handler: React.PropTypes.node.required
};

export default Route;
