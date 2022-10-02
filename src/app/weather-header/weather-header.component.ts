import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IForecast, WeatherService } from '../weather.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupWindowComponent } from '../popup-window/popup-window.component';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-weather-header',
  templateUrl: './weather-header.component.html',
  styleUrls: ['./weather-header.component.scss']
})
export class WeatherHeaderComponent implements OnInit {

  @ViewChild('myInputRef') myInputRef: ElementRef<HTMLInputElement> | null = null

  input: boolean = false
  cityName: string = ''
  celciusToggle: boolean = false
  fahrenheitToggle: boolean = false
  error: string = '';
  sub: Subscription | null = null
  form: FormGroup;
  myControl = new FormControl('', Validators.required)
  options: string[] = []
  filteredOptions: Observable<string[]> | null = null

  constructor (private weatherService: WeatherService, private dialog: MatDialog, private http: HttpClient) {
    this.form = new FormGroup({
      input: this.myControl
    })
  }

  ngOnInit(): void {
  this.weatherService.getCitiesList()
  this.weatherService.citiesList.subscribe(
    (value: string[]) => {
      this.options = value
    }
  )

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.weatherService.getForecast(this.form.value.input)
    this.weatherService.forecast
    .subscribe((forecastData: IForecast) => {
      this.cityName = forecastData.name
      this.celciusToggle = true
      this.fahrenheitToggle = false
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  showInput(): void {
    this.input = !this.input;
    setTimeout(() => { 
      if (this.myInputRef !== null && this.myInputRef !== undefined) {
      this.myInputRef.nativeElement.focus();
    }
  }, 10)
  }

  getForecast(): void{
      this.weatherService.getForecast(this.form.value.input)
      this.weatherService.forecast
      .subscribe((forecastData: IForecast) => {
        this.cityName = (forecastData.name)
      })
      this.input = !this.input
    this.sub = this.weatherService.errorMessage
    .subscribe((error: string) => { 
      this.error = error
      if (this.error) {
        this.dialog.open(PopupWindowComponent)
      }
      console.log(this.error)
    })
    setTimeout(() => {
      if (this.sub !== null) {
      this.sub.unsubscribe()
    }}, 700)
    this.form.reset()
  }

  toggleTofahrenheit(): void {
    this.weatherService.toggleTofahrenheit()
  }

  toggleToCelcius(): void {
    this.weatherService.toggleToCelcius()
  }

  cancel(): void {
    this.input = !this.input
    this.form.reset()
  }

}
