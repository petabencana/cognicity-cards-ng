import { Component, OnInit, Input } from '@angular/core';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { isEqual } from 'lodash';
// import * as L from 'leaflet'

import { DeckService } from '../../services/cards/deck.service';
import { MONUMEN_NASIONAL_LAT_LNG } from "../../../utils/const";
import { environment as env } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

declare let L

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  @Input() type: string
  @Input() searchText: string
  @Input() locateText: string
  provider: any
  map: any

  private currentMarker: any
  public latlng: { lat: string, lng: string }
  searchResults

  constructor(
    private deckService: DeckService,
    public translate: TranslateService
    ) { }

  ngOnInit() {
    this.deckService.userCannotBack()

    this.checkIsUserAbleToContinue()

    let { lat, lng } = env.default_location;

    if (this.deckService.getLocation()) {
      lat = this.deckService.getLocation().lat
      lng = this.deckService.getLocation().lng
    }

    // this.map = L.map('mapid', {
    //   center: [ lat, lng ],
    //   zoom: 16
    // });
    mapboxgl.accessToken = 'pk.eyJ1IjoicGV0YWJlbmNhbmEiLCJhIjoiY2s2MjF1cnZmMDlxdzNscWc5MGVoMTRkeCJ9.PGcoQqU6lBrcLfBmvTrWrQ';
    this.map = new mapboxgl.Map({
      container: 'mapid', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center:[lng , lat], // starting position [lng, lat]
      zoom: 16, // starting zoom
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: false,
      showUserLocation: false,
    });

    this.map.addControl(geolocate);

    // If user not approve permission
    if (this.currentMarker) this.currentMarker.remove(this.map);

    this.addMarker();

    this.provider = new OpenStreetMapProvider();

    this.map.on('load', () => {
      geolocate.trigger();
    });

    geolocate.on('geolocate', (event) => {
      // If location already same, no net to disable it again
      if (
        isEqual(this.map.getCenter(), {
          lng: event.coords.longitude,
          lat: event.coords.latitude,
        })
      ) {
        this.deckService.userCannotContinue();
      }
    });

    geolocate.on('trackuserlocationend', () => {
      if (this.currentMarker) this.currentMarker.remove(this.map);
      this.addMarker();
    });
  }

  ngOnDestroy() {
    this.deckService.userCannotBack();
    this.deckService.userCannotContinue();
  }

  checkIsUserAbleToContinue() {
    // If user already move the map they can continue
    if (this.deckService.location) {
      this.deckService.userCanContinue()
    } else {
      this.deckService.userCannotContinue()
    }
  }

  async onSearch(query: string) {
    query = query + env.loc_search_suffix;
    const minimumCharCount = 3
    const results = query.split(',')[0].length > minimumCharCount && await this.provider.search({ query }) // Optimising the calls made to search api
    this.searchResults = results; //we send this to the child component search-location
  }

  async onConfirmSearch(query: string) {
    const results = await this.provider.search({ query });
    this.map.flyTo({
      center: [results[0].x, results[0].y],
      essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
    if (this.currentMarker) this.currentMarker.remove(this.map)
    const imageElement = document.createElement('div');
    imageElement.className = 'marker';
    imageElement.style.backgroundImage = `url(${this.icon})`;
    imageElement.style.width = `30px`;
    imageElement.style.position = 'relative';
    imageElement.style.height = `60px`;
    imageElement.style['background-repeat'] = 'no-repeat';
    imageElement.style.backgroundSize = '100%';

    // Add markers to the map.
    const marker = new mapboxgl.Marker({
      element : imageElement,
      draggable:true
    })
      .setLngLat([results[0].x, results[0].y])
      .addTo(this.map);
    if (this.currentMarker) this.currentMarker.remove(this.map)
    this.currentMarker = marker

    marker.on('dragend' , () => {
      const lngLat = marker.getLngLat();
        if (!isEqual(this.map.getCenter(), {lng : lngLat.lng , lat: lngLat.lat})) {
            this.deckService.userCanContinue()
            this.deckService.setLocation({ lat : lngLat.lat, lng: lngLat.lng })
      }
    });
  }
  
  private addMarker() {
    const { lat, lng } = this.map.getCenter();
   

    const imageElement = document.createElement('div');

    imageElement.className = 'marker';
    imageElement.style.backgroundImage = `url(${this.icon})`;
    imageElement.style.width = `30px`;
    imageElement.style.position = 'relative';
    imageElement.style.height = `60px`;
    imageElement.style['background-repeat'] = 'no-repeat';
    imageElement.style.backgroundSize = '100%';

    // Add markers to the map.
    const marker = new mapboxgl.Marker({
        element : imageElement,
        draggable:true
    })
      .setLngLat([lng, lat])
      .addTo(this.map);

      marker.on('dragend' , () => {
      const lngLat = marker.getLngLat();
         if (!isEqual(this.map.getCenter(), {lng : lngLat.lng , lat: lngLat.lat})) {
             this.deckService.userCanContinue()
             this.deckService.setLocation({ lat : lngLat.lat, lng: lngLat.lng })
      }
      })
    if (this.currentMarker) this.currentMarker.remove(this.map)
    this.currentMarker = marker
  }

  get icon() {
    switch (this.type) {
      case 'flood':
        return '../../../assets/decks/flood/AddFloodIcon_Location.png'
      case 'structure':
        return '../../../assets/decks/earthquake/eqlocation/AddStructureFailureIcon_Location.png'
      case 'road':
        return '../../../assets/decks/earthquake/eqlocation/AddAccessReportIcon_Location.png'
      case 'wind':
        return '../../../assets/decks/wind/windlocation/Wind_Pin.png'
      case 'volcano':
        return '../../../assets/decks/volcano/location/Select_Report_Location.png'
      case 'haze':
        return '../../../assets/decks/fire/location/SelectHazeLocation.png';
      case 'need':
        return '../../../assets/decks/logistics/AddNeedIcon_location.png';
      default:
        return '../../../assets/decks/fire/location/SelectHazeLocation.png';
    }
  }
}
