import { Component, OnInit } from '@angular/core';
import { DeckService } from '../../../services/cards/deck.service';
import flatpickr from 'flatpickr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dateandtime',
  templateUrl: './dateandtime.component.html',
  styleUrls: ['./dateandtime.component.scss'],
})
export class DateandtimeComponent implements OnInit {
  selectedDate: string;
  selectedTime: string;

  constructor(
    public deckService: DeckService,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.deckService.userCanBack();
    this.selectedDate = this.deckService.getDonationdate() || '';
    this.selectedTime = this.deckService.getDonationtime() || '';
    this.openCalendar();
    this.openTimePicker();

    if (
      this.deckService.donationDate !== undefined &&
      this.deckService.donationTime !== undefined
    ) {
      this.deckService.userCanContinue();
    } else {
      this.deckService.userCannotContinue();
    }
  }

  get dateandtimeHeader(): string {
    return this.translate.instant('card.giverLabels.dateandtimeHeader');
  }

  get dateandtimeDescription(): string {
    return this.translate.instant('card.giverLabels.dateandtimeDescription');
  }

  get selecteddate(): string {
    return this.translate.instant('card.giverLabels.selectedDate');
  }

  get selectedtime(): string {
    return this.translate.instant('card.giverLabels.selectedTime');
  }

  openCalendar() {
    flatpickr('#calendar', {
      inline: true,
      defaultDate: this.selectedDate, // Prefill calendar with selected date
      minDate: new Date().toISOString().split('T')[0],
      maxDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      onChange: (selectedDates, dateStr, instance) => {
        this.selectedDate = dateStr;
        this.deckService.setDonationdate(this.selectedDate);
        if (
          this.deckService.donationDate !== undefined &&
          this.deckService.donationTime !== undefined
        ) {
          this.deckService.userCanContinue();
        } else {
          this.deckService.userCannotContinue();
        }
      },
    });
  }

  openTimePicker() {
    flatpickr('#time', {
      inline: true,
      defaultDate: this.selectedTime, // Prefill time picker with selected time
      enableTime: true,
      noCalendar: true,
      dateFormat: 'h:i K', // 'h' for 12-hour format, 'i' for minutes, 'K' for AM/PM
      onChange: (selectedDates, dateStr, instance) => {
        this.selectedTime = dateStr;
        this.deckService.setDonationtime(this.selectedTime);
        if (
          this.deckService.donationDate !== undefined &&
          this.deckService.donationTime !== undefined
        ) {
          this.deckService.userCanContinue();
        } else {
          this.deckService.userCannotContinue();
        }
      },
    });
  }

 
}
