import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonMenu } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import {_User} from './model/User';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonMenu) menu: IonMenu;

  public menuDisabled: boolean;
  public isAdmin: boolean;

  constructor(private authS: AuthService, private router: Router) {
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

  public async goToHistory(){
    await this.router.navigate(['prices-history']);
    await this.menu.close();
  }

  public disableMenu() {
    this.menuDisabled = this.router.url === '/';
    this.authS.loadSession().then((user: _User)=>{
      if(user){
        this.isAdmin = user.admin;
      }
    });
  }

}
