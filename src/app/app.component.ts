import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonMenu } from '@ionic/angular';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonMenu) menu: IonMenu;

  public menuDisabled: boolean;

  constructor(private authS: AuthService,
    private router: Router) {}

  public async logout(){
    await this.authS.logout();
    this.router.navigate(['']);
    this.menu.close();
  }

  public async goToPrices(){
    this.router.navigate(['price']);
    this.menu.close();
  }

  public disableMenu() {
    if(this.router.url==='/'){
      this.menuDisabled=true;
    }else{
      this.menuDisabled=false;
    }
  }
}
