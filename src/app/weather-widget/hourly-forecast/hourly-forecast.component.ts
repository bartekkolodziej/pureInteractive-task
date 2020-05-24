import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {HourlyForecast} from '../weather-widget.component';

@Component({
  selector: 'app-hourly-forecast',
  templateUrl: './hourly-forecast.component.html',
  styleUrls: ['./hourly-forecast.component.scss']
})
export class HourlyForecastComponent implements OnInit {

  @Input() hourlyForecast: HourlyForecast;
  @Input() minMaxTemp: [number, number];
  @Input() minMaxPressure: [number, number];
  @Input() maxRainfall: number;

  @ViewChild('arrow', {static: true})
  arrow;

  @ViewChild('rainfallIndicator', {static: true})
  rainfallIndicator;


  temperatureDivHeight = 200; // can change, it is set by css
  pressureDivHeight = 150; // can change, it is set by css
  rainfallDivHeight = 80;

  constructor() {
  }

  ngOnInit() {
    this.rotateWindDirectionArrow(this.hourlyForecast.windDirection.degree);
    this.setRainfallIndicatorHeight();
  }

  rotateWindDirectionArrow(deg): void {
    this.arrow.nativeElement.style.mozTransform = 'rotate(' + deg + 'deg)';
    this.arrow.nativeElement.style.msTransform = 'rotate(' + deg + 'deg)';
    this.arrow.nativeElement.style.oTransform = 'rotate(' + deg + 'deg)';
    this.arrow.nativeElement.style.transform = 'rotate(' + deg + 'deg)';
  }

  getVerticalPositionForTemperaturePoint(temperature: number): number {
    return (temperature - this.minMaxTemp[0]) * (this.temperatureDivHeight / (this.minMaxTemp[1] - this.minMaxTemp[0])) - 5;
  }

  getVerticalPositionForPressurePoint(pressure: number): number {
    return (pressure - this.minMaxPressure[0]) * (this.pressureDivHeight / (this.minMaxPressure[1] - this.minMaxPressure[0])) - 30;
  }

  setRainfallIndicatorHeight(): void {
    if (this.hourlyForecast.rainfall) {
      this.rainfallIndicator.nativeElement.style.height
        = (this.hourlyForecast.rainfall.value * (this.rainfallDivHeight / this.maxRainfall)) + 'px';
    }
  }
}

