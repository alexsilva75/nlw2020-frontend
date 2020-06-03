import React from 'react'
import {Route, BrowserRouter as Router} from 'react-router-dom'

import Home from './Home'
import CreatePoint from './CreatePoint'

const Routes = props => {

    return (
        <Router>
            <Route exact path='/' component={Home}/>
            <Route path='/create-point' component={CreatePoint} />
        </Router>
    )
}

export default Routes