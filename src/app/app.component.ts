import { Component } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  showHeader = false;
  showBackBtn = false;

  imageClickCounter = 0;
  videoClickCounter = 0;
  toggleMenu = false;
  currentPage = '/';
  pageTitle = 'Home';

  constructor(private router: Router, private dataService: DataService) {

    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const urlArr = e.url.split('/');
        if (urlArr.indexOf('home') > -1 || urlArr[1] === '') {
          this.showHeader = true;
          this.showBackBtn = false;
        } else {
          this.showHeader = false;
          this.showBackBtn = true;
        }
      }
    });

  }

  // triggering camera for capture images
  triggerCamera() {
    this.dataService.updatedInputTrigger(this.imageClickCounter);
    this.imageClickCounter++;
  }

  // function for triggering video camera
  triggerVideoCamera() {
    this.dataService.updatedVideoInputTrigger(this.videoClickCounter);
    this.videoClickCounter++;
  }

  // toggle side menu bar
  toggleSideBar() {
    this.toggleMenu = !this.toggleMenu;
  }

  // for page navigation
  goToPage(pagePath, pageTitle) {
    this.currentPage = pagePath;
    this.pageTitle = pageTitle;
    this.toggleSideBar();
    this.router.navigate([pagePath]);
  }

}
