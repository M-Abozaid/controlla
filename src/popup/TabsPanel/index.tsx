import React from 'react'

import Box from '@material-ui/core/Box'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AppBar from '@material-ui/core/AppBar'

import GavelIcon from '@material-ui/icons/Gavel'
import EqualizerIcon from '@material-ui/icons/Equalizer'

import Typography from '@material-ui/core/Typography'

interface TabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

function iconProps(index: any) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  }
}

const TabsPanel = () => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  return (
    <div className='tabs-panel__main'>
      <AppBar position='static' color='default'>
        <Tabs
          value={value}
          onChange={handleChange}
          variant='scrollable'
          scrollButtons='on'
          indicatorColor='primary'
          textColor='primary'
          aria-label='scrollable force tabs example'
        >
          <Tab label='Rules' icon={<GavelIcon />} {...iconProps(0)} />
          <Tab label='Stats' icon={<EqualizerIcon />} {...iconProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        Rules
      </TabPanel>
      <TabPanel value={value} index={1}>
        Stats
      </TabPanel>
    </div>
  )
}

export default TabsPanel
