import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NavigationService } from '../../../services/navigation.service';
import { DeckService } from '../../../services/cards/deck.service'
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent {
  items: {
    title: string,
    hint: string,
    subtype: string,
    imgUrl: string,
    highlightImgUrl: string,
  }[]

  constructor(
    public translate: TranslateService,
    public navController: NavigationService,
    public route: ActivatedRoute,
    private router: Router,
    public deckService: DeckService,
  ) {
    this.initItems()
    // Store card routes for navigation
    this.navController.registerCardRoutes('earthquake');
  }

  initItems() {
    switch(this.deckService.getDeckType()) {
      case 'earthquake': this.items = [
        {
          title: 'card.type.earthquake.roadTypeButton',
          hint: '',
          subtype: 'road',
          imgUrl: '../../../../assets/decks/earthquake/eqtype/AddAccessReportIcon.png',
          highlightImgUrl: '../../../../assets/decks/earthquake/eqtype/AddAccessReportIcon_Click.png'
        },
        {
          title: 'card.type.earthquake.structureTypeButton',
          hint: '',
          subtype: 'structure',
          imgUrl: '../../../../assets/decks/earthquake/eqtype/AddStructureFailureIcon.png',
          highlightImgUrl: '../../../../assets/decks/earthquake/eqtype/AddStructureFailureIcon_Click.png'
        }
      ].filter(item => !this.deckService.finishedSubType.includes(item.subtype)); break;
    }
  }

  onTypeSelected(subtype) {
    // console.log('currentRouteName',this.navController.getCurrentRouteName());
    this.deckService.setDeckSubType(subtype);
    this.navController.filterRoutes(subtype);
    this.deckService.userCanContinue();
    this.navController.nextFromChild(this.route, '../../../');

  }
}
