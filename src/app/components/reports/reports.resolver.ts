import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable, forkJoin } from 'rxjs';
import { take, tap, first, map } from 'rxjs/operators';

import { AuthenticationService } from '../../shared/services/others/authentication.service';
import { SourcesService } from 'src/app/shared/services/api/sources.service';
import { ProjectsService } from 'src/app/shared/services/api/projects.service';
import { RatingsService } from 'src/app/shared/services/api/ratings.service';
import { ReportsService } from 'src/app/shared/services/api/reports.service';
import { Utils } from 'src/app/shared/helpers/utilities';
import { TeamsService } from 'src/app/shared/services/api/teams.service';
import { UsersService } from 'src/app/shared/services/api/users.service';

@Injectable()
export class ReportsResolver implements Resolve<any> {
  constructor(
    private sourcesService: SourcesService,
    private projectsService: ProjectsService,
    private ratingsService: RatingsService,
    private reportsService: ReportsService,
    private teamsService: TeamsService,
    private usersService: UsersService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin(
      // this.sourcesService.getList().pipe(first()),
      // this.projectsService.getList().pipe(first()),
      // this.ratingsService.getRatingNamesList().pipe(first()),
      this.reportsService.aggregateReports(null).pipe(first()),
      // this.teamsService.getList().pipe(first()),
      // this.usersService.getList().pipe(first())
    ).pipe(map(res => {
      const tableColumns = [
        'userName',
        'goldenHours',
        'selfPouring',
        'regularPouring',
        'pushCount',
        'suggestionCount',
        'emailCount',
        'zaloFlirtingCount'
      ],
        // sourcesList = res[0],
        // projectsList = res[1],
        // ratingsList = res[2],
        reportsData = res[0],
        // teamsList = res[4],
        // usersList = res[5].items,
        pourList = [],
        pushList = [],
        othersList = [];
      // ratingsList.forEach(rating => {
      //   if (
      //     rating.name.includes('F0') ||
      //     rating.name === 'F1' ||
      //     rating.name === 'F1A' ||
      //     rating.name === 'F2' ||
      //     rating.name === 'F2+'
      //   ) {
      //     pourList.push(rating);
      //   }

      //   if (
      //     rating.name.includes('F1') ||
      //     rating.name.includes('F2') ||
      //     rating.name.includes('F3')
      //   ) {
      //     pushList.push(rating);
      //   }

      //   if (rating.name.includes('F4')) {
      //     othersList.push(rating);
      //   }
      // });
      // sourcesList.forEach((source: ModelItemSource, index) => {
      //   source.pour = pourList;
      //   source.push = pushList;
      //   source.others = othersList;
      //   source.column = 'column' + index;
      //   tableColumns.push(source.column);
      //   const projectsTooltipList = [];
      //   projectsList.forEach(item => {
      //     projectsTooltipList.push(`${item.name}: ${Utils.randomNumber(1, 9)}` );
      //   });
      //   source.projectsTooltip = projectsTooltipList.join(', ');
      // });
      return {
        reportsData: reportsData,
        tableColumns: tableColumns,
        // sourcesList: sourcesList,
        // teamsList: teamsList,
        // usersList: usersList
      };
    }
    ));
  }
}


class ModelItemSource {
  sourceName = '';
  sourceColor = '';
  pour = [];
  push = [];
  others = [];
  projectsTooltip = '';
  column = '';
  f_four = '';
  f_four_plus = '';
  constructor() { }
}

