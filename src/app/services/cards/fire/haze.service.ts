import { Injectable } from "@angular/core";

interface LatLng {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: "root"
})
export class HazeService {
  hazeLocation: LatLng;
  hazeVisibility: number;
  airQuality: string = "0";
  hazePreview: File;
  hazeDescription: string;

  // Getter
  getHazeLocation(): LatLng {
    return this.hazeLocation;
  }

  getHazeVisibility(): number {
    return this.hazeVisibility;
  }

  getAirQuality(): string {
    return this.airQuality;
  }

  getHazePreview(): File {
    return this.hazePreview;
  }

  gethazeDescription(): string {
    return this.hazeDescription;
  }

  // Setter
  setHazeLocation(newHazeLocation: LatLng) {
    this.hazeLocation = newHazeLocation;
  }

  setHazeVisibility(newHazeVisibility: number) {
    this.hazeVisibility = newHazeVisibility;
  }

  setAirQuality(newAirQuality: string) {
    console.log({ newAirQuality })
    this.airQuality = newAirQuality;
  }

  setHazePreview(newHazePreview: File) {
    this.hazePreview = newHazePreview;
  }

  sethazeDescription(newHazeDescription: string) {
    this.hazeDescription = newHazeDescription;
  }
}