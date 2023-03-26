import React from 'react';
import VideoUploader from './upload/VideoUploader';
import { MantineProvider } from '@mantine/core';
import { mantinetheme, useStyles } from './mantineStyles';
import "./App.css"


function App() {
  const { classes } = useStyles();
  return (
    <div className='component'>
      <MantineProvider theme={mantinetheme} >
        <div className={classes.child}><VideoUploader /></div>
      </MantineProvider>
    </div>
  );
}

export default App;