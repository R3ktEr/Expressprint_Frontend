import { Component, OnInit } from '@angular/core';
import { _User } from 'src/app/model/User';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ViewChild } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  @ViewChild(IonDatetime)
  public datetime: IonDatetime;
  
  public user:_User;
  public dateFormatted:string;
  public dateTime:string;

  constructor(private authS:AuthService, private notS:NotificationsService) {
    
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.notS.presentLoading();

    this.user=await this.authS.loadSession();

    await this.notS.dismissLoading();
  }

  prueba(){
    console.log(this.datetime.value)
  }

  confirm() {
    
    
  }
  
  reset() {
    //this.datetime.reset();
  }

  async formatDate(value: string) {
    let date= format(parseISO(value), 'dd-MM-yyyy HH:mm');
    this.dateFormatted=date;
    console.log(date)
    return date
  }
}
