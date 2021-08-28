import React, { useState, useEffect } from 'react'
import './styles.scss'
import AddRule from '../AddRule'

import { Settings, Add, PlayArrow, Pause } from '@material-ui/icons'
import { Tooltip, Zoom, Drawer, Switch } from '@material-ui/core'
import storage from '../../common/storage'
import { ProgressBar } from 'react-bootstrap'
import settings from '../../common/settings'


const Header = () => {
  const [showAddRuleModal, toggleAddRuleModal] = useState(false)



  const [isControlPaused, setIsControlPaused] = useState(storage.isControlPaused())
  const [isControlPauseAllowed, setIsControlPauseAllowed] = useState(true)

  const [pauseUsagePercent, setPauseUsagePercent] = useState(0)
  const toggleIsControlPaused = (evt?): void => {
    if (!isControlPauseAllowed) return;
    if(storage.isControlPaused()){
      setIsControlPaused(false)
      storage.resumeControl()
    } else {
      setIsControlPaused(true)
      storage.pauseControl()
    }
  }
  const checkControlPausedUsage = ()=>{
    const controlUsage = storage.getOrCreatePauseUsage();
    if (controlUsage.usage >= settings.pauseQuota && isControlPauseAllowed) {
      setIsControlPauseAllowed(false)
    } else if(!isControlPauseAllowed) {
      setIsControlPauseAllowed(true)
    }
    setPauseUsagePercent((controlUsage.usage/settings.pauseQuota)*100)
    setIsControlPaused(storage.isControlPaused())
  }
  useEffect(() => {
    checkControlPausedUsage();
    const intervalId = setInterval(checkControlPausedUsage, settings.tickDuration);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className={`header__container `}>
      <div className={`header__main black`}>
        <div className='header__title'>
          <span>Controlla</span>
        </div>

        <div>
          <div className='header__button'>
            <Tooltip
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 300 }}
              title='Add Rule'
              arrow
            >
              <Add onClick={() => toggleAddRuleModal(true)} />
            </Tooltip>
          </div>
          <button className='header__button' onClick={toggleIsControlPaused} disabled={!isControlPauseAllowed} >
            <Tooltip
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 300 }}
              title='Pause control'
              arrow
            >
          { isControlPaused?  <PlayArrow   /> :<Pause  />  }
            </Tooltip>
          </button>
          <div className='header__button'>
            <Tooltip
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 300 }}
              title='Settings'
              arrow
            >
              <Settings onClick={() => chrome.tabs.create( { url: "/settings.html"} )} />
            </Tooltip>
          </div>


        </div>
        </div>
      <ProgressBar
                    className='control__usage__progress-bar'
                    now={pauseUsagePercent}
                    label={`${pauseUsagePercent} %`}
                />
      </div>
      <div>
        {showAddRuleModal && (
          <AddRule
            onRuleAdded={() => null}
            onHide={() => toggleAddRuleModal(false)}
          />
        )}
      </div>
    </>
  )
}
export default Header
