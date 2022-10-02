import { Component, OnInit } from '@angular/core';
import { IForecast, WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather-footer',
  templateUrl: './weather-footer.component.html',
  styleUrls: ['./weather-footer.component.scss']
})
export class WeatherFooterComponent implements OnInit {

  windSpeedValue: number = 1;
  pressureValue: number = 1;
  humidityValue: number = 1;
  windDegreeDirection: number = 1;

  constructor(private weatherService: WeatherService) {
    
   }

  ngOnInit(): void {
    this.weatherService.deafaultForecast
    .subscribe((value: IForecast) => {
      this.windSpeedValue = value.windSpeed;
      this.pressureValue = value.pressure / 1.33;
      this.humidityValue = value.humidity;
      this.windDegreeDirection = value.windDegreeDirection;
    })
    this.weatherService.forecast
    .subscribe((value: IForecast) => {
      this.windSpeedValue = value.windSpeed;
      this.pressureValue = value.pressure / 1.33;
      this.humidityValue = value.humidity;
      this.windDegreeDirection = value.windDegreeDirection;
    })
  }

}
