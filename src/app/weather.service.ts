import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, pipe, Subject, Subscription } from 'rxjs';

export interface IForecast {
  name: string
  tempValue: number
  description: string
  windSpeed: number
  windDegreeDirection: number
  pressure: number
  humidity: number
}

export interface IForecastResponse {
  name: string
  weather: [{description: string}]
  wind: IForecastWind
  main: IForecastMain
}

export interface IForecastWind {
  speed: number
  deg: number
}

export interface IForecastMain {
  temp: number
  pressure: number
  humidity: number
}

export interface ICities {
  name: string
  city: [{name: string}]
}

@Injectable({
  providedIn: 'root'
})

export class WeatherService {

  deafaultForecast: Subject<IForecast> = new Subject;
  forecast: Subject<IForecast> = new Subject;
  tempValueFahrenheit: Subject<number> = new Subject;
  tempValueCelcius: Subject<number> = new Subject;
  errorMessage: Subject<string> = new Subject;
  citiesList: Subject<string[]> = new Subject
  
  dailyForecast: IForecast = {
    name: '',
    tempValue: 1,
    description: '',
    windSpeed: 1,
    windDegreeDirection: 1,
    humidity: 1,
    pressure: 1,
  }

  sub: Subscription | null = null
  options: string[] = []

  constructor (private http: HttpClient) {

  }

  getCitiesList(): void {
    const cities$ = this.http.get<ICities>('https://raw.githubusercontent.com/aZolo77/citiesBase/master/cities.json')
    this.sub = cities$
    .pipe(
     map((value: ICities) => {
     for (let i = 0; i < value.city.length; i++) {
      this.options.push(value.city[i].name)
     }
     return this.options
    })
    )
    .subscribe((value: string[]) => 
    this.citiesList.next(value))
   }

  getForecast(inputText: string): void {
    this.http.get<IForecastResponse>(`https://api.openweathermap.org/data/2.5/weather?q=${inputText ? inputText : 'Moscow'}&appid=f0610b2780ddf88848af9b17b769c802&units=metric`)
    .subscribe((response: IForecastResponse) => {
      this.dailyForecast = {
        name: response.name,
        tempValue: response.main.temp,
        description: response.weather[0].description,
        windSpeed: response.wind.speed,
        windDegreeDirection: response.wind.deg,
        pressure: response.main.pressure,
        humidity: response.main.humidity,
      }
      this.forecast.next(this.dailyForecast)
      this.deafaultForecast.next(this.dailyForecast)
    }, error => {
      let message = error.message
      this.errorMessage.next(message)
    })
  }

  toggleTofahrenheit(): void {
    let fahrenheitValue = Math.round(this.dailyForecast.tempValue)
    this.tempValueFahrenheit.next(fahrenheitValue)
  }

  toggleToCelcius(): void {
    let celciusValue = Math.round(this.dailyForecast.tempValue)
    this.tempValueCelcius.next(celciusValue)
  }

}