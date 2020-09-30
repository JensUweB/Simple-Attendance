import {AfterViewInit, Component, OnInit} from '@angular/core';

import {AnimationController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {ActivatedRoute} from '@angular/router';
import { GroupService } from './core/groups/services/group.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  public selectedIndex = 0;
  public isDarkMode = false;
  public appPages = [
    {
      title: 'Groups',
      url: '/groups',
      icon: 'people'
    },
    {
      title: 'Students',
      url: '/students',
      icon: 'person'
    },
    {
      title: 'New Training',
      url: '/training/new',
      icon: 'list'
    },
    {
      title: 'Training Archive',
      url: '/training/archive',
      icon: 'archive'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private animCtrl: AnimationController,
    private route: ActivatedRoute,
    private groupService: GroupService
  ) {
    this.initializeApp();
  }

  ngAfterViewInit() {
    setInterval(() => {
      const elements = document.getElementById('title');
      const animRed = this.animCtrl.create()
          .addElement(elements)
          .duration(2000)
          .iterations(1)
          .fromTo('color', 'white', 'red');
      animRed.play().then(() => {
        const animWhite = this.animCtrl.create()
            .addElement(elements)
            .duration(2000)
            .iterations(1)
            .fromTo('color', 'red', 'white');
        animWhite.play();
      });
    }, 4000);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
    document.body.setAttribute('color-theme', localStorage.getItem('theme'));
    if (localStorage.getItem('theme') === 'dark') {
      this.isDarkMode = true;
    }
  }

  onToggleTheme(event) {
    if (event?.detail?.checked) {
      document.body.setAttribute('color-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }
}
