import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { DeckService } from '../../services/cards/deck.service'

@Component({
  selector: 'app-report-review',
  templateUrl: './report-review.component.html',
  styleUrls: ['./report-review.component.scss']
})
export class ReportReviewComponent implements OnInit, AfterViewChecked {

  previewImg: HTMLImageElement

  constructor(
    public deckService: DeckService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initPreviewImg()

  }
  ngAfterViewChecked() {
    if (this.deckService.getDeckSubType() === 'haze') this.initHazeReview()
    this.cdRef.detectChanges()
  }

  initPreviewImg() {
    this.previewImg = document.getElementById('preview-img') as HTMLImageElement

    if (this.deckService.getPreview()) {
      this.setImagePreview(this.deckService.getPreview())
    } else {
      let previewImgSrc
      switch (this.deckService.getDeckSubType()) {
        case 'fire': previewImgSrc = '../../../assets/decks/fire/review/Fire.png'; break;
        case 'volcano': previewImgSrc = '../../../assets/decks/volcano/review/volcano.png'; break;
        case 'haze': previewImgSrc = [
          "../../../../assets/decks/fire/visibility/Visibility_High.jpg",
          "../../../../assets/decks/fire/visibility/Visibility_Medium.jpg",
          "../../../../assets/decks/fire/visibility/Visibility_Low.jpg",
        ][this.deckService.getVisibility()]; break;
        case 'wind': previewImgSrc = [
          "../../../../assets/decks/wind/windstructure/Graphic_Cracking.png",
          "../../../../assets/decks/wind/windstructure/Graphic_PartialCollapse.png",
          "../../../../assets/decks/wind/windstructure/Graphic_TotalCollapse.png",
        ][this.deckService.getStructureFailure()]; break;
        case 'structure': previewImgSrc = [
          "../../../../assets/decks/earthquake/structure/StructureFailure_1.png",
          "../../../../assets/decks/earthquake/structure/StructureFailure_2.png",
          "../../../../assets/decks/earthquake/structure/StructureFailure_3.png",
        ][this.deckService.getStructureFailure()]; break;
        case 'road': previewImgSrc = [
          "../../../../assets/decks/earthquake/condition/RoadCondition_1.png",
          "../../../../assets/decks/earthquake/condition/RoadCondition_2.png",
          "../../../../assets/decks/earthquake/condition/RoadCondition_3.png",
        ][this.deckService.getCondition()]; break;
        default: previewImgSrc = 'https://via.placeholder.com/150'; break;
      }
      this.previewImg.setAttribute('src', previewImgSrc)
      if (this.deckService.getDeckSubType() === 'volcano') {
        this.previewImg.style.maxHeight = '100px';
      }
    }
  }

  initHazeReview() {
    const visibilityImg = document.getElementById('visibility') as HTMLImageElement
    const airqualityImg = document.getElementById('airquality') as HTMLImageElement
    const airqualityText = document.getElementById('airquality-text') as HTMLParagraphElement

    let visibilityImgSrc = '../../../assets/decks/fire/review/visibility/Visibility_Indicator'
    let airqualityImgSrc = '../../../assets/decks/fire/review/airquality/Air_Quality_Indicator'
    let airqualityTextColor = 'white';

    switch (this.deckService.getVisibility()) {
      case 0: visibilityImgSrc += '_Low.png'; break;
      case 1: visibilityImgSrc += '_Medium.png'; break;
      case 2: visibilityImgSrc += '_High.png'; break;      
    }

    const airQuality = this.deckService.getAirQuality()
    switch (airQuality) {
      case 1: airqualityImgSrc += '_Moderate.png'; airqualityTextColor = 'lightgreen'; break;
      case 2: airqualityImgSrc += '_Poor.png'; airqualityTextColor = 'yellow'; break;      
      case 3: airqualityImgSrc += '_Severe.png'; airqualityTextColor = 'orange' ;break;      
      case 4: airqualityImgSrc += '_Hazardous.png'; airqualityTextColor = 'red'; break;      
    }

    visibilityImg.setAttribute('src', visibilityImgSrc)
    if (airQuality > 0) { 
      airqualityImg.setAttribute('src', airqualityImgSrc)
      airqualityText.style.color = airqualityTextColor
    }
  }

  setImagePreview(file: File) {
    const reader = new FileReader()
    reader.onload = (e: any) => {
      this.previewImg.setAttribute('src', e.target.result)
    }
    reader.readAsDataURL(file)
  }

  get description() {
    return this.deckService.getDescription()
  }

  get deckType() {
    return this.deckService.getDeckSubType()
  }

  // Fire

  get fireRange() {
    const radius = this.deckService.getFireDistance()
    const range = Math.PI * Math.pow(radius, 2) / 10000
    
    if (range < 1) return '<1'
    return range.toFixed(2)
  }

  // Haze

  get airQuality() {
    const quality = this.deckService.getAirQuality()

    switch(quality) {
      case 0: return ''
      case 1: return 'Moderate'
      case 2: return 'Poor'
      case 3: return 'Severe'
      case 4: return 'Hazardous'
    }
  }

  get visibility() {
    const visibleValue = this.deckService.getVisibility()

    switch (visibleValue) {
      case 0: return 'High'
      case 1: return 'Moderate'
      case 2: return 'Low'
    }
  }

  // Road
  get accessibility() {
    return this.deckService.getAccessibility()
  }

  get accessibilityHint() {
    const accessibility = this.deckService.getAccessibility()

    if (accessibility <= 0.5) {
      return "No Vehicle"
    } else if (accessibility <= 1.0) {
      return "2-Wheel Vehicle"
    } else if(accessibility <= 1.4) {
      return "4-Wheel Vehicle"
    } else if (accessibility <= 1.8) {
      return "Large Vehicle"
    } else {
      return "Large Vehicle (Truck)"
    }
  }

  get condition() {
    const condition = this.deckService.getCondition()

    switch (condition) {
      case 0: return 'Light'
      case 1: return 'Moderate'
      case 2: return 'Heavy'
    }
  }

  // Structure
  get structuralFailure() {
    const failure = this.deckService.getStructureFailure()

    switch(failure) {
      case 0: return 'Cracking'
      case 1: return 'Partially Collapsed'
      case 2: return 'Fully Collapsed'
    }
  }

  get structuralFailureColor() {
    const failure = this.deckService.getStructureFailure()

    switch(failure) {
      case 0: return '#ffde17'
      case 1: return '#f7941d'
      case 2: return '#be1e2d'
    }
  }
}
