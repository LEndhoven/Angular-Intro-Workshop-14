import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControl } from 'ngx-typesafe-forms';
import {
  combineLatest,
  filter,
  map,
  Observable,
  skip,
  Subscription,
  withLatestFrom,
} from 'rxjs';
import { observeProperty } from '../../../../shared/rxjs-utils/observe-property';
import { Project, ProjectEntry } from '../../models';
import { Memoized } from '../../../../shared/decorators';
import { notUndefined } from '../../../../shared/predicates';
import { HourEntryService } from '../../services/hour-entry.service';
import { cache } from '../../../../shared/rxjs-utils';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const TIME_ENTRIES = [...Array(33).keys()].map(
  (keyIndex) =>
    `${Math.floor(keyIndex / 4)}:${((15 * keyIndex) % 60)
      .toString()
      .padStart(2, '0')}`
);
@Component({
  selector: 'app-project-entry',
  templateUrl: './project-entry.component.html',
  styleUrls: ['./project-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class ProjectEntryComponent implements OnInit, OnDestroy {
  @Input() public projectEntry: ProjectEntry;

  public readonly projectControl = new FormControl<string | Project>('', [
    Validators.required,
  ]);

  public readonly descriptionControl = new FormControl<string>('', [
    Validators.required,
  ]);
  public readonly spentTimeControl = new FormControl<string>('', [
    Validators.required,
  ]);

  private readonly subscriptions = new Subscription();

  constructor(private readonly hourEntryService: HourEntryService) {}

  public ngOnInit(): void {
    this.subscriptions.add(this.initializeInputFields());
    this.subscriptions.add(this.updateProjectEntryOnChanges());
  }

  public ngOnDestroy(): void {
    this.hourEntryService.updateProjectEntry({
      id: this.projectEntry.id,
      date: this.projectEntry.date,
      projectCode:
        typeof this.projectControl.value === 'string'
          ? undefined
          : this.projectControl.value.code,
      description: this.descriptionControl.value,
      timeSpent: this.spentTimeControl.value,
    });

    this.subscriptions.unsubscribe();
  }

  public displayProjectName(project: Project): string {
    return project.name;
  }

  @Memoized public get filteredProjects$(): Observable<Project[]> {
    return this.projectControl.value$.pipe(
      withLatestFrom(this.hourEntryService.availableProjects$),
      map(([searchText, availableProjects]) =>
        typeof searchText === 'string'
          ? availableProjects.filter((project) =>
              project.name.toLowerCase().includes(searchText.toLowerCase())
            )
          : availableProjects
      ),
      cache()
    );
  }

  @Memoized public get filteredTimes$(): Observable<string[]> {
    return this.spentTimeControl.value$.pipe(
      map((searchText) =>
        TIME_ENTRIES.filter((timeEntry) => timeEntry.includes(searchText))
      ),
      cache()
    );
  }

  private initializeInputFields(): Subscription {
    return this.projectEntry$
      .pipe(withLatestFrom(this.hourEntryService.availableProjects$))
      .subscribe(([projectEntry, projects]) => {
        this.projectControl.setValue(
          projects.find(({ code }) => projectEntry.projectCode === code) ?? ''
        );
        this.descriptionControl.setValue(projectEntry.description ?? '');
        this.spentTimeControl.setValue(projectEntry.timeSpent ?? '');
      });
  }

  private updateProjectEntryOnChanges(): Subscription {
    return combineLatest([
      this.projectControl.value$,
      this.descriptionControl.value$,
      this.spentTimeControl.value$,
    ])
      .pipe(skip(1))
      .subscribe(([project, description, spentTime]) =>
        this.hourEntryService.updateProjectEntry({
          id: this.projectEntry.id,
          date: this.projectEntry.date,
          projectCode: typeof project === 'string' ? undefined : project.code,
          description: description,
          timeSpent: spentTime,
        })
      );
  }

  @Memoized private get projectEntry$(): Observable<ProjectEntry> {
    return observeProperty(this as ProjectEntryComponent, 'projectEntry').pipe(
      filter(notUndefined),
      cache()
    );
  }
}
