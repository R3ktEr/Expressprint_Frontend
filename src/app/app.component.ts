import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonMenu, Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { FcmService } from './services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonMenu) menu: IonMenu;

  public menuDisabled: boolean;

  constructor(private authS: AuthService,
    private router: Router,
    private platform: Platform,
    private fcmService: FcmService) {

      this.initializeApp();
    }

  initializeApp() {
    if(this.platform.is("android")) {
      this.platform.ready().then(() => {
        // Trigger the push setup 
        this.fcmService.initPush();
      });
    }
  }

  public async logout(){
    await this.authS.logout();
    await this.router.navigate(['']);
    await this.menu.close();
  }

  public async goToPrices(){
    await this.router.navigate(['price']);
    await this.menu.close();
  }

  public async goToOrders(){
    await this.router.navigate(['private/tabs/tab1']);
    await this.menu.close();
  }

  public disableMenu() {
    this.menuDisabled = this.router.url === '/';
  }
}
