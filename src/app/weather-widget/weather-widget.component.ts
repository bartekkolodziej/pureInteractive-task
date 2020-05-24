import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

// API KEY: 711cae0a32c1e8c4ea1af62792c64b95

@Component({
  selector: 'app-weather-widget',
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.scss']
})
export class WeatherWidgetComponent implements OnInit {

  constructor(private http: HttpClient) {
  }

  hourlyForecastList: Array<HourlyForecast> = [];

  minMaxTemp: [number, number] = [0, 0];
  minMaxPressure: [number, number] = [0, 0];
  maxRainfall = 0;

  static convertDegreeToWindDirection(degree: number): string {
    if (338 <= degree && degree < 23) {
      return 'North';
    } else if (23 <= degree && degree < 68) {
      return 'North east';
    } else if (68 <= degree && degree < 113) {
      return 'East';
    } else if (113 <= degree && degree < 158) {
      return 'South east';
    } else if (158 <= degree && degree < 203) {
      return 'South';
    } else if (203 <= degree && degree < 248) {
      return 'South west';
    } else if (248 <= degree && degree < 293) {
      return 'West';
    } else {
      return 'North west';
    }
  }

  static mapElementToHourlyForecastInterface(el: any, index: number, array: Array<any>): HourlyForecast {
    return {
      day: (el.dt_txt as string).split(' ')[0],
      hour: (el.dt_txt as string).split(' ')[1].slice(0, 5),
      forecast: {iconURL: WeatherWidgetComponent.getIconURL(el.weather[0].icon), description: el.weather[0].description},
      currentTemperature: {value: Math.round(el.main.temp - 273), unit: 'celsius'},
      temperatureInThreeHours: array[index + 1] ? {value: Math.round(array[index + 1].main.temp - 273), unit: 'celsius'} : null,
      rainfall: el.rain ? {value: el.rain['3h'], unit: 'mm'} : null,
      windDirection: {degree: el.wind.deg, description: WeatherWidgetComponent.convertDegreeToWindDirection(el.wind.deg)},
      windSpeed: {value: el.wind.speed, unit: 'm/s'},
      currentPressure: {value: el.main.pressure, unit: 'hPa'},
      pressureInThreeHours: array[index + 1] ? {value: array[index + 1].main.pressure, unit: 'hPa'} : null,
    };
  }

  static getIconURL(icondID: string): string {
    return `http://openweathermap.org/img/wn/${icondID}@2x.png`;
  }

  ngOnInit() {
    this.getFiveDayForecast('Warsaw');
  }

  getFiveDayForecast(cityName: string): void {
    this.http.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=711cae0a32c1e8c4ea1af62792c64b95`)
      .subscribe((res: any) => {
        this.hourlyForecastList = (res.list as Array<any>).map(WeatherWidgetComponent.mapElementToHourlyForecastInterface);
        this.getMinMaxTemp();
        this.getMinMaxPressure();
        this.getMaxRainfall();
      });
  }

  getMinMaxTemp(): void {
    this.minMaxTemp[0] = this.hourlyForecastList[0].currentTemperature.value;
    this.minMaxTemp[1] = this.hourlyForecastList[0].currentTemperature.value;
    this.hourlyForecastList.forEach(e => {
      if (e.currentTemperature.value <= this.minMaxTemp[0]) {
        this.minMaxTemp[0] = e.currentTemperature.value;
      }
      if (e.currentTemperature.value >= this.minMaxTemp[1]) {
        this.minMaxTemp[1] = e.currentTemperature.value;
      }
    });
  }

  getMinMaxPressure(): void {
    this.minMaxPressure[0] = this.hourlyForecastList[0].currentPressure.value;
    this.minMaxPressure[1] = this.hourlyForecastList[0].currentPressure.value;
    this.hourlyForecastList.forEach(e => {
      if (e.currentPressure.value <= this.minMaxPressure[0]) {
        this.minMaxPressure[0] = e.currentPressure.value;
      }
      if (e.currentPressure.value >= this.minMaxPressure[1]) {
        this.minMaxPressure[1] = e.currentPressure.value;
      }
    });
  }

  getMaxRainfall() {
    this.hourlyForecastList.forEach(e => {
      if (e.rainfall && e.rainfall.value > this.maxRainfall) {
        this.maxRainfall = e.rainfall.value;
      }
    });
  }

}

export interface HourlyForecast {
  day: string;
  hour: string;
  forecast: { iconURL: string, description: string };
  currentTemperature: { value: number, unit: string };
  temperatureInThreeHours: { value: number, unit: string };
  rainfall: { value: number, unit: string } | null;
  windDirection: { degree: number, description: string };
  windSpeed: { value: number, unit: string };
  currentPressure: { value: number, unit: string };
  pressureInThreeHours: { value: number, unit: string };
}
