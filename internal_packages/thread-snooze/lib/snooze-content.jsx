/** @babel */
import _ from 'underscore';
import React, {Component, PropTypes} from 'react';
import {Actions, DateUtils} from 'nylas-exports'
import {RetinaImg} from 'nylas-component-kit';
import SnoozeActions from './snooze-actions'


const SnoozeOptions = [
  [
    'Later Today',
    'Tonight',
    'Tomorrow',
  ],
  [
    'This Weekend',
    'Next Week',
    'Next Month',
  ],
]

const SnoozeDateGenerators = {
  'Later Today': DateUtils.laterToday,
  'Tonight': DateUtils.tonight,
  'Tomorrow': DateUtils.tomorrow,
  'This Weekend': DateUtils.thisWeekend,
  'Next Week': DateUtils.nextWeek,
  'Next Month': DateUtils.nextMonth,
}

const SnoozeIconNames = {
  'Later Today': 'later',
  'Tonight': 'tonight',
  'Tomorrow': 'tomorrow',
  'This Weekend': 'weekend',
  'Next Week': 'week',
  'Next Month': 'month',
}


class SnoozeContent extends Component {
  static displayName = 'SnoozeContent';

  static propTypes = {
    threads: PropTypes.array.isRequired,
    swipeCallback: PropTypes.func,
  };

  static defaultProps = {
    swipeCallback: ()=> {},
  };

  onSnooze(dateGenerator) {
    const utcDate = dateGenerator().utc()
    const formatted = DateUtils.format(utcDate)
    SnoozeActions.snoozeThreads(this.props.threads, formatted);
    this.props.swipeCallback(true);
    Actions.closePopover();
  }

  onBlur = ()=> {
    this.props.swipeCallback(false);
    Actions.closePopover();
  };

  onKeyDown = (event)=> {
    if (event.key === "Escape") {
      this.props.swipeCallback(false);
      Actions.closePopover()
    }
  };

  renderItem = (label)=> {
    const dateGenerator = SnoozeDateGenerators[label];
    const iconName = SnoozeIconNames[label]
    const iconPath = `nylas://thread-snooze/assets/ic-snoozepopover-${iconName}@2x.png`
    return (
      <div
        key={label}
        className="snooze-item"
        onMouseDown={this.onSnooze.bind(this, dateGenerator)}>
        <RetinaImg
          url={iconPath}
          mode={RetinaImg.ContentIsMask} />
        {label}
      </div>
    )
  };

  renderRow = (options, idx)=> {
    const items = _.map(options, this.renderItem)
    return (
      <div key={`snooze-popover-row-${idx}`} className="snooze-row">
        {items}
      </div>
    );
  };

  renderInputRow = ()=> {
    // TODO
  };

  render() {
    const rows = SnoozeOptions.map(this.renderRow)

    return (
      <div tabIndex="1" className="snooze-container" onBlur={this.onBlur} onKeyDown={this.onKeyDown}>
        {rows}
      </div>
    );
  }

}

export default SnoozeContent;
