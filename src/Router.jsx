import React from 'react';
import { HistoryLocation } from 'common-history';
import RouterError from './RouterError';

global.historyLocation = new HistoryLocation();

class Router extends React.Component
{
    constructor(props) {
        super(props);

        let currentState = '';

        if (typeof window === 'undefined') {
            if (typeof props.path === 'undefined') {
                throw new Error('Must pass a `path` prop to the Router when rendering on the server');
            }

            currentState = props.path;
        }

        if (currentState === '') {
            currentState = window.location.pathname;
        }

        if (currentState === null) {
            throw new RouterError('No pathname found or passed to the prop!');
        }

        this.state = {
            path: currentState,
            stateHandler: null,
            elementName: ''
        };

        this.verifyChildren = this.verifyChildren.bind(this);
        this.findChildByName = this.findChildByName.bind(this);
    }

    componentWillMount() {
        this.verifyChildren();

        let matcher = this.props.matcher.bind(this);
        let path = this.props.path === undefined ? this.state.path : this.props.path;

        this.setState({
            elementName: matcher(path)
        });

        if (typeof window === 'undefined') {
            console.log("Mounted and there is no window, so returning");
            return;
        }

        global.historyLocation.addListener(changes => {
            let innerMatcher = this.props.matcher.bind(this);

            this.setState({
                path: changes.path,
                elementName: innerMatcher(changes.path)
            });
        });
    }

    verifyChildren() {
        let error = false;
        let child = null;

        if (typeof this.props.children === 'undefined'
         || this.props.children.length === 0) {
            throw new RouterError('You must pass at least one Route to a Router');
        }

        React.Children.forEach((val, key) => {
            if (typeof val.props.routeName === 'undefined') {
                error = true;
                child = val;
            }
        });

        if (error === true) {
            throw new Error('Each child of the Router must have a `name` prop.', child);
        }
    }

    // FIXME: Handle the rendering case of a single route properly
    findChildByName(name) {
        let res = null;

        if (React.Children.count(this.props.children) === 0) {
            throw new Error('No matching child with routeName `' + name + '`');
        }

        if (React.Children.count(this.props.children) === 1) {
            if (React.Children.only(this.props.children).props.routeName === name) {
                return 0;
            }
        }

        this.props.children.some((el, i) => {
            if (el.props.routeName === name) {
                res = i;
                return true;
            }
        });

        if (res === null) {
            throw new Error('No matching child with routeName `' + name + '`');
        }

        return res;
    }

    render() {
        let index = -1;
        let ele = <div>Default 404</div>;

        if (typeof this.props.notFound !== 'undefined') {
            index = this.findChildByName(this.props.notFound);
        }

        if (this.state.elementName !== '') {
            index = this.findChildByName(this.state.elementName);
        }

        if (index !== -1) {
            ele = this.props.children[index];
        }

        let propSet = {
            matches: this.state.matches,
            handler: ele.props.handler,
            path: this.state.path
        };

        if ('flux' in ele.props) {
            propSet.flux = ele.props.flux;
        }

        return (
            <div>
                {React.cloneElement(ele, propSet)}
            </div>
        );
    }
}

Router.propTypes = {
    matcher: React.PropTypes.func.required,
    children: React.PropTypes.element.required
};

export default Router;
