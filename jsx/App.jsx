import React from 'react';
import ReactDOM from 'react-dom';
import AirQuality from "./AirQuality.jsx";

class App extends React.Component{
    render(){
        return (
            <div>

                <AirQuality />

            </div>
        )
    }
}

document.addEventListener('DOMContentLoaded', function(){


    ReactDOM.render(
        <App/>,
        document.getElementById('app')
    );
});