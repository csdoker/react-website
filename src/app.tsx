import React from 'react'
import { Route, Switch } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import store from './store'
import { storeContext } from './utils/use'
import Main from './Main'

const App = () => {
  return (
    <storeContext.Provider value={store}>
      <BrowserRouter>
        <Main/>
      </BrowserRouter>
    </storeContext.Provider>
  )
}

export default App
