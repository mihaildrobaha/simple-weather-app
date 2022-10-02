import { Component, OnInit } from '@angular/core';
import { IForecast, WeatherService } from '../weather.service';


@Component({
  selector: 'app-weather-content',
  templateUrl: './weather-content.component.html',
  styleUrls: ['./weather-content.component.scss']
})
export class WeatherContentComponent implements OnInit {

  tempValue: number = 1;
  weatherDescription: string = ''
  weatherDegree: string = '°C'

constructor (private weatherService: WeatherService) {

}

ngOnInit () {
  this.weatherService.deafaultForecast
  .subscribe(value => {
    this.tempValue = value.tempValue
    this.weatherDescription = value.description
  })
  this.weatherService.forecast
  .subscribe((value: IForecast) => {
    this.tempValue = value.tempValue
    this.weatherDescription = value.description
  })
  this.weatherService.tempValueFahrenheit
  .subscribe((value: number) => {
    this.tempValue = value;
    this.weatherDegree = '°F'
  })
  this.weatherService.tempValueCelcius
  .subscribe((value: number) => {
    this.tempValue = value
    this.weatherDegree = '°C'
  })
}

}
