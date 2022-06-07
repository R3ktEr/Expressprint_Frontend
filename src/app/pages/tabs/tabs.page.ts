import { Component } from '@angular/core';
import { _User } from 'src/app/model/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public isAdmin:boolean;

  constructor(private authS:AuthService) {
    
  }

  ionViewWillEnter() {
    this.authS.loadSession().then((user: _User)=>{
      if(user){
        this.isAdmin = user.admin;
      }
    });
  }
}
