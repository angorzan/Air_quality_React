import React from 'react';
import ReactDOM from 'react-dom';
import {Bar} from 'react-chartjs-2';

class AirQuality extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pm25: null,
            pm10: null,
            street: null,
            lat: 0,
            lon: 0,
            chartVisibility: 'invisible',

        }
    }

    componentDidMount(){
        let button = document.querySelector('button.chartButton');
        console.log(button);
        button.nextElementSibling.classList.add('hidden');

    }

    handleClick = (e) => {
        e.target.nextElementSibling.classList.remove('hidden');
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position);
            let myHeaders = {'apikey': '6777c55a879246c99c1242bea6bb7ac9'};
            let myInit = {headers: myHeaders};

            fetch('https://airapi.airly.eu/v1/nearestSensor/measurements?latitude=' + position.coords.latitude + '&longitude=' + position.coords.longitude + '&maxDistance=1000', myInit)
                .then(resp => resp.json())
                .then(data => {
                    const pm10standard24h = 50;
                    const pm25standard24h = 25;
                    const pm10perc = (data.pm10/pm10standard24h*100).toFixed(2);
                    const pm25perc = (data.pm25/pm25standard24h*100).toFixed(2);

                    console.log(pm10perc);
                    console.log(pm25perc);

                        this.setState({
                            lat: position.coords.latitude,
                            lon: position.coords.longitude,
                            pm25: data.pm25,
                            pm10: data.pm10,
                            street: data.address.route,
                            chartData: {
                                labels: ["PM10", "PM2.5", "PM10%", "PM2.5%"],
                                datasets: [{
                                    label: 'Air quality',
                                    data: [data.pm10, data.pm25, pm10perc, pm25perc],
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)'
                                    ],
                                    borderColor: [
                                        'rgba(255,99,132,1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255,99,132,1)',
                                        'rgba(54, 162, 235, 1)'

                                    ],
                                    borderWidth: 1
                                }]
                            },
                            chartOptions: {
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true
                                        }
                                    }]
                                }
                            },
                            chartVisibility: 'visible',
                        })
                    }
                )
                .catch(e => console.log(e));
        })
    };


    render() {

        return (
            <div>
                <div>
                    <div className="container">

                        <h2>Check Air Quality</h2>
                        <button onClick={this.handleClick} className="chartButton btn btn-info">Get your position</button>
                        {
                            this.state.chartData &&
                            <div>
                                <div className="position container">
                                    <p>Your current position: lat: {this.state.lat.toFixed(2)}</p>
                                    <p>  lon: {this.state.lon.toFixed(2)} </p> </div>
                                <div className="air container">
                                    <p>street: {this.state.street} </p>
                                    <p> Air quality: PM2.5  {this.state.pm25.toFixed(2)}</p>
                                    <p> PM10  {this.state.pm10.toFixed(2)}</p></div>
                            </div>
                        }
                        <Bar data={this.state.chartData} options={this.state.chartOptions} />

                    </div>

                </div>
            </div>
        );
    }
}




module.exports = AirQuality;