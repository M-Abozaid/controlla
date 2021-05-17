import * as React from 'react';
import './styles.scss';
import { getRuleTitle, mapDayNumber } from '../Services';

import { ProgressBar, ButtonGroup, Button } from 'react-bootstrap';
import TimerIcon from '@material-ui/icons/Timer';
import DateRangeIcon from '@material-ui/icons/DateRange';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { Tooltip, Zoom } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import Close from '@material-ui/icons/Close';
import Rule from '../../common/Rule';
import moment from 'moment';

interface RuleProps {
    rule: Rule;
}

const RuleComponent: React.FC<RuleProps> = ({ rule }) => {
    const { activeUsage } = rule.usage;
    const { activeQuota, startTime, endTime, daysOfWeek } = rule.ruleObj;

    console.log('rule object ', rule.ruleObj)
    const quotaPercentage = Math.round((activeUsage / activeQuota) * 100);

    const restQuota = activeQuota - activeUsage;

    const daysNumber = [0, 1, 2, 3, 4, 5, 6];

    const removeRule = async () => {
        await rule.remove();
    };

    return (
        <div className='rule__main'>
            <div className='rule__header'>
                <div
                    className={`rule__effective__badge  ${
                        rule.isEffectiveNow() ? 'active' : ''
                    }`}
                >
                    <Tooltip
                        TransitionComponent={Zoom}
                        TransitionProps={{ timeout: 200 }}
                        title={
                            rule.isEffectiveNow() ? 'Rule is active' : 'Rule is inactive'
                        }
                        arrow
                    >
                        <FiberManualRecordIcon />
                    </Tooltip>
                </div>

                <div className='rule__type'>{rule.ruleObj.matcher.type}</div>
                <div className='rule__tools'>
                    <Tooltip
                        TransitionComponent={Zoom}
                        TransitionProps={{ timeout: 200 }}
                        title='Edit Rule'
                        arrow
                    >
                        <div className='rule__edit'>
                            <EditIcon />
                        </div>
                    </Tooltip>

                    <Tooltip
                        TransitionComponent={Zoom}
                        TransitionProps={{ timeout: 200 }}
                        title='Remove rule'
                        arrow
                    >
                        <div onClick={removeRule} className='remove__rule'>
                            <Close></Close>
                        </div>
                    </Tooltip>
                </div>
            </div>
            <h4 className='rule__title'>{getRuleTitle(rule.ruleObj.matcher)}</h4>

            <div>
                <ProgressBar
                    className='rule__progress-bar'
                    now={quotaPercentage}
                    label={`${quotaPercentage} %`}
                />
                <span className='rule__progress-time'>
                    {`${moment(restQuota).format('mm:ss')}`}
                </span>
            </div>

            <div className='rule__time-day'>
                <TimerIcon />
                <span>Start: {startTime}</span>
                <span>End: {endTime}</span>
                <span>Quota: {moment().startOf('day').add(activeQuota,'ms').format('HH:mm')} </span>
            </div>

            <div className='rule__days-week'>
                <DateRangeIcon />
                <ButtonGroup
                    className='rule__days-week--group'
                    aria-label='days-of-week-gruop'
                >
                    {daysNumber.map((dayNum, idx) => (
                        <Button
                            key={idx}
                            size='sm'
                            variant={daysOfWeek.includes(dayNum) ? 'primary' : 'light'}
                        >
                            {moment(dayNum, 'd').format('dd')}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>
        </div>
    );
};

export default RuleComponent;
