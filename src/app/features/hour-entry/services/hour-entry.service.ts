import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, of } from 'rxjs';
import { cache } from '../../../shared/rxjs-utils';
import { Memoized } from '../../../shared/decorators';
import { generateGuid } from '../../../shared/utils';
import { Project, ProjectEntry } from '../models';

const AVAILABLE_PROJECTS: Project[] = [
  { name: 'General Development Scheme', code: 'GENDS' },
  { name: 'General Meetings', code: 'GENME' },
  { name: 'Awesome Workshop', code: 'AWORK' },
];

@Injectable()
export class HourEntryService {
  private readonly currentDateSubject = new BehaviorSubject<Date>(new Date());
  private readonly projectEntriesByDateSubject = new BehaviorSubject<
    Map<number, ProjectEntry[]>
  >(new Map<number, ProjectEntry[]>());

  public updateCurrentDate(newCurrentDate: Date): void {
    this.currentDateSubject.next(newCurrentDate);
  }

  public updateProjectEntry(projectEntry: ProjectEntry): void {
    const currentProjectEntriesByDate = new Map(
      this.projectEntriesByDateSubject.getValue()
    );

    const currentProjectEntries = [
      ...(currentProjectEntriesByDate.get(projectEntry.date.getTime()) ??
        ([] as ProjectEntry[])),
    ];

    const usedIndex = currentProjectEntries.findIndex(
      ({ id }) => id === projectEntry.id
    );

    if (usedIndex < 0) {
      return;
    }

    currentProjectEntries.splice(usedIndex, 1, projectEntry);
    currentProjectEntriesByDate.set(
      projectEntry.date.getTime(),
      currentProjectEntries
    );

    this.projectEntriesByDateSubject.next(currentProjectEntriesByDate);
  }

  public addEmptyProjectEntry(): void {
    const currentDate = this.currentDateSubject.getValue();
    const currentProjectEntriesByDate = new Map(
      this.projectEntriesByDateSubject.getValue()
    );

    const currentProjectEntries = [
      ...(currentProjectEntriesByDate.get(currentDate.getTime()) ??
        ([] as ProjectEntry[])),
    ];

    currentProjectEntries.push({ id: generateGuid(), date: currentDate });
    currentProjectEntriesByDate.set(
      currentDate.getTime(),
      currentProjectEntries
    );

    this.projectEntriesByDateSubject.next(currentProjectEntriesByDate);
  }

  public duplicateProjectEntry(projectEntry: ProjectEntry): void {
    const currentProjectEntriesByDate = new Map(
      this.projectEntriesByDateSubject.getValue()
    );
    const currentProjectEntries = [
      ...(currentProjectEntriesByDate.get(projectEntry.date.getTime()) ??
        ([] as ProjectEntry[])),
    ];

    const entryIndex = currentProjectEntries.findIndex(
      ({ id }) => id === projectEntry.id
    );

    if (entryIndex < 0) {
      return;
    }

    const duplicatedProjectEntry: ProjectEntry = {
      ...projectEntry,
      id: generateGuid(),
    };

    currentProjectEntries.splice(entryIndex, 0, duplicatedProjectEntry);
    currentProjectEntriesByDate.set(
      projectEntry.date.getTime(),
      currentProjectEntries
    );

    this.projectEntriesByDateSubject.next(currentProjectEntriesByDate);
  }

  public removeProjectEntry(projectEntry: ProjectEntry): void {
    const currentProjectEntriesByDate = new Map(
      this.projectEntriesByDateSubject.getValue()
    );
    const currentProjectEntries = [
      ...(currentProjectEntriesByDate.get(projectEntry.date.getTime()) ??
        ([] as ProjectEntry[])),
    ];

    const entryIndex = currentProjectEntries.findIndex(
      ({ id }) => id === projectEntry.id
    );

    if (entryIndex < 0) {
      return;
    }

    currentProjectEntries.splice(entryIndex, 1);
    currentProjectEntriesByDate.set(
      projectEntry.date.getTime(),
      currentProjectEntries
    );

    this.projectEntriesByDateSubject.next(currentProjectEntriesByDate);
  }

  public moveProjectEntry(oldIndex: number, newIndex: number): void {
    const currentDate = this.currentDateSubject.getValue();
    const currentProjectEntriesByDate = new Map(
      this.projectEntriesByDateSubject.getValue()
    );
    const currentProjectEntries = [
      ...(currentProjectEntriesByDate.get(currentDate.getTime()) ?? []),
    ];
    moveItemInArray(currentProjectEntries, oldIndex, newIndex);

    currentProjectEntriesByDate.set(
      currentDate.getTime(),
      currentProjectEntries
    );

    this.projectEntriesByDateSubject.next(currentProjectEntriesByDate);
  }

  @Memoized public get currentDate$(): Observable<Date> {
    return this.currentDateSubject.asObservable();
  }

  @Memoized public get availableProjects$(): Observable<Project[]> {
    return of(AVAILABLE_PROJECTS).pipe(
      map((projects) =>
        [...projects].sort((project1, project2) =>
          project1.name.localeCompare(project2.name)
        )
      ),
      cache()
    ); // Redundant Observable flow, only used to mimic a server call setup
  }

  @Memoized public get currentProjectEntries$(): Observable<ProjectEntry[]> {
    return combineLatest([
      this.currentDate$,
      this.projectEntriesByDateSubject,
    ]).pipe(
      map(
        ([currentDate, projectEntriesByDate]) =>
          projectEntriesByDate.get(currentDate.getTime()) ??
          ([] as ProjectEntry[])
      ),
      cache()
    );
  }
}
