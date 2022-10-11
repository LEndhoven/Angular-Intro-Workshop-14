import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatLuxonDateModule,
  MAT_LUXON_DATE_FORMATS,
} from '@angular/material-luxon-adapter';
import { MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HourEntryComponent } from './features/hour-entry/hour-entry.component';

export const CUSTOM_MAT_LUXON_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'dd-MM-yyyy',
  },
  display: {
    dateInput: 'dd-MM-yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'DDD',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,

    MatLuxonDateModule,

    HourEntryComponent,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'nl-NL' },
    {
      provide: MAT_LUXON_DATE_FORMATS,
      useValue: CUSTOM_MAT_LUXON_DATE_FORMATS,
    },
  ],
})
export class AppModule {}
