import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

import { NavigationService } from '../../../services/navigation.service';
import { DeckService } from '../../../services/cards/deck.service';
import { environment as env } from '../../../../environments/environment';

@Component({
  selector: 'app-flood',
  templateUrl: './flood.component.html',
  styleUrls: ['./flood.component.scss']
})
export class FloodComponent implements OnInit {

  constructor(
    public translate: TranslateService,
    public route: ActivatedRoute,
    public navController: NavigationService,
    public deckService: DeckService
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(env.default_language);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(this.deckService.getCardLanguage());

    // Store card routes for navigation
    this.navController.registerCardRoutes('flood');

    // Check for first card, else redirect
    this.navController.checkForFirstCard(this.route);

    this.deckService.setDeckType('flood')
    this.deckService.setDeckSubType('flood')
    this.deckService.setRoute(route)
  }

  ngOnInit() { }

}
