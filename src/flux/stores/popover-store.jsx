import React from 'react';
import Actions from '../actions'
import {FixedPopover} from 'nylas-component-kit';


const CONTAINER_ID = "nylas-popover-container";

function createContainer(id) {
  const element = document.createElement(id);
  element.setAttribute('id', id);
  element.setAttribute('class', id);
  document.body.appendChild(element);
  return element;
}

class PopoverStore {

  constructor(containerId = CONTAINER_ID) {
    super()
    this.container = (
      document.getElementById('nylas-popover-container') ||
      createContainer(containerId)
    );
    React.render(<FixedPopover showing={false} />, this.container)

    Actions.openPopover.listen(this.onOpenPopover);
    Actions.closePopover.listen(this.onClosePopover);
  }

  onOpenPopover(element, originRect, direction) {
    React.render(
      <FixedPopover
        showing
        originRect={originRect}
        direction={direction}>
        {element}
      </FixedPopover>
    , this.container)
  }

  onClosePopover() {
    React.render(
      <FixedPopover showing={false} />
    , this.container)
  }

}

export default new PopoverStore();
