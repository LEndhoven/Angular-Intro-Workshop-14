import { NgModule } from '@angular/core';

import { TimeFormatPipe } from './time-format.pipe';

@NgModule({
  declarations: [TimeFormatPipe],
  exports: [TimeFormatPipe],
})
export class TimeFormatPipeModule {}
