import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-router',
  template: ''
})
export class ProjectRouterComponent implements OnInit {

  constructor(
    private router: Router
  ) {
    console.log('project router component constructor');
  }

  ngOnInit() {
    // this.router.navigate([Utils.getProjectRouter()]);
  }

}
