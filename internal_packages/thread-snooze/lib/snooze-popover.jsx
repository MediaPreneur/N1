/** @babel */
import _ from 'underscore';
import React, {Component, PropTypes} from 'react';
import {DateUtils} from 'nylas-exports'
import {Popover, RetinaImg} from 'nylas-component-kit';
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


class SnoozePopover extends Component {
  static displayName = 'SnoozePopover';

  static propTypes = {
    threads: PropTypes.array.isRequired,
    buttonComponent: PropTypes.object.isRequired,
    direction: PropTypes.string,
    pointerStyle: PropTypes.object,
    popoverStyle: PropTypes.object,
  };

  onSnooze(dateGenerator) {
    const utcDate = dateGenerator().utc()
    const formatted = DateUtils.format(utcDate)
    SnoozeActions.snoozeThreads(this.props.threads, formatted)
  }

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

  };

  render() {
    const {buttonComponent, direction, popoverStyle, pointerStyle} = this.props
    const rows = SnoozeOptions.map(this.renderRow)

    return (
      <Popover
        className="snooze-popover"
        direction={direction || 'down-align-left'}
        buttonComponent={buttonComponent}
        popoverStyle={popoverStyle}
        pointerStyle={pointerStyle}>
        <div className="snooze-container">
          {rows}
        </div>
      </Popover>
    );
  }

}

export default SnoozePopover;
