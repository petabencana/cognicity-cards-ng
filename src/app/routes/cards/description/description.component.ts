import { Component, OnInit } from '@angular/core';
import { DeckService } from '../../../../app/services/cards/deck.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {
  constructor(
    public deckService: DeckService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.deckService.userCanBack()
    this.deckService.userCanContinue()
  }
}
