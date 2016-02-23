import _ from 'underscore';
import React, {Component, PropTypes} from 'react';


/**
 * Renders a popover absultely positioned in the window next to the provided
 * rect.
 * This popover will not automatically be closed. The user must completely
 * control the lifecycle of the Popover via `Actions.openPopover` and
 * `Actions.closePopover`
 * If `Actions.openPopover` is called when the popover is already open, it will
 * close the previous one and open the new one.
 * @class FixedPopover
 **/
class FixedPopover extends Component {

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.element,
    direction: PropTypes.string,
    showing: PropTypes.bool,
    originRect: PropTypes.shape({
      bottom: PropTypes.number,
      top: PropTypes.number,
      right: PropTypes.number,
      left: PropTypes.number,
      height: PropTypes.number,
      width: PropTypes.number,
    }),
  };

  static defaultProps = {
    direction: 'up',
  };

  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      dimensions: {},
    };
    this._focusOnOpen = props.showing;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showing === true) {
      this._focusOnOpen = true;
    }
  }

  componentDidUpdate() {
    if (this._focusOnOpen) {
      this._focusImportantElement()
      this._focusOnOpen = false
    }
  }

  _focusImportantElement = ()=> {
    // Automatically focus the element inside us with the lowest tab index
    const popover = React.findDOMNode(this.refs.popover)

    // _.sortBy ranks in ascending numerical order.
    const matches = _.sortBy(popover.querySelectorAll("[tabIndex], input"), (node)=> {
      if (node.tabIndex > 0) {
        return node.tabIndex;
      } else if (node.nodeName === "INPUT") {
        return 1000000
      }
      return 1000001
    })
    if (matches[0]) {
      matches[0].focus();
    }
  };

  _computePopoverStyles = (originRect, direction)=> {
    let popoverStyle = {};
    let pointerStyle = {};
    let containerStyle = {};
    switch (direction) {
    case 'up':
      // TODO
      break;
    case 'down':
      // TODO
      break;
    case 'left':
      // TODO
      break;
    case 'right':
      containerStyle = {
        top: originRect.top,
        left: originRect.left + originRect.width,
      }
      popoverStyle = {
        // TODO
        // For now, position directly next to originRect. The only current use
        // case is the snooze popover, so this prevents the popover from flowing
        // outside the window when the first thread is snoozed.
        // This needs to be correctly implemented.
        transform: 'translate(10px, 0)',
      }
      pointerStyle = {
        // TODO
      }
      break;
    default:
      break;
    }
    return {containerStyle, popoverStyle, pointerStyle};
  };

  render() {
    const {children, direction, showing, originRect} = this.props;
    const {containerStyle, popoverStyle, pointerStyle} = this._computePopoverStyles(originRect, direction);

    if (!showing) {
      return <span />;
    }
    return (
      <div
        style={containerStyle}
        className="fixed-popover-container"
        onKeyDown={this._onKeyDown}>
        <div ref="popover" className="fixed-popover" style={popoverStyle}>
          {children}
        </div>
        <div className="fixed-popover-pointer" style={pointerStyle} />
        <div className="fixed-popover-pointer shadow" style={pointerStyle} />
      </div>
    );
  }

}

export default FixedPopover;
