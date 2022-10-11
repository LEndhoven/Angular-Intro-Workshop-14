import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
})
export class TimeFormatPipe implements PipeTransform {
  public transform(totalNumberOfMinutes: number): string {
    const numberOfMinutes = totalNumberOfMinutes % 60;
    const numberOfHours = Math.floor(totalNumberOfMinutes / 60);

    return `${numberOfHours}:${numberOfMinutes.toString().padStart(2, '0')}`;
  }
}
