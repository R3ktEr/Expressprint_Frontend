import {Component} from '@angular/core';
import {Order} from 'src/app/model/Order';
import {OrderService} from 'src/app/services/order.service';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {_User} from '../../model/User';
import {ModalController, NavController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {LocalStorageService} from '../../services/local-storage.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { OrderDetailsPage } from '../order-details/order-details.page';
import { PushNotifications } from '@capacitor/push-notifications';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public user: _User;
  public isAdmin: boolean;
  public orders: Order[];
  public showPayed: boolean;
  public showPickedUp: boolean;
  private ordersCopy: Order[];
  private readonly dataIncoming: any;
  private filter: any;
  private readonly noPrices: string;

  constructor(private orderService: OrderService, private authS: AuthService, private router: Router, private navController: NavController,
              private route: ActivatedRoute, private localstorage: LocalStorageService, private notS: NotificationsService,
              private modalController: ModalController,) {
    this.ordersCopy = [];
    this.orders = [];

    this.filter = {
      payed: false,
      pickedUp: false
    };

    try{
      this.dataIncoming=this.route.snapshot.params.user;
      this.noPrices = this.route.snapshot.params.precios;

      if(this.dataIncoming){
        this.user=this.dataIncoming;
        this.isAdmin=this.user.admin;
      }
    }catch(err){
      console.log(err);
    }

    this.showPayed=false;
    this.showPickedUp=false;
  }

  async ionViewWillEnter() {
    this.user=await this.authS.loadSession();
    this.isAdmin=this.user.admin;

    await this.notS.presentLoading();

    if (this.isAdmin) {
      this.getAllOrders();
      if(this.noPrices){
        await this.notS.presentToast(this.noPrices,'danger');
      }
    } else {
      await this.getOrders();
    }

    //this.resetBadgeCount()

    await this.notS.dismissLoading();
  }

  public async getOrders():Promise<void> {
    this.orderService.getOrdersByUser(this.user.id).toPromise().then(value => {
      this.orders = value;
      this.sortOrdersByDate();
      this.ordersCopy = [];
      this.orders.forEach(values => {
        this.ordersCopy.push(values);
      });
    }).catch(err=>{
      
    });
  }

  public async getAllOrders() {
    await this.orderService.getAllOrders().pipe(map(value => value.map(c => ({key: c.id, ...c})))).toPromise().then(value => {
      this.orders = value;
      this.sortOrdersByDate();
      this.ordersCopy = [];
      this.orders.forEach(values => {
        this.ordersCopy.push(values);
      });
    })
  }

  private sortOrdersByDate(){
    this.orders = this.orders.sort(
      (order1, order2) => new Date(order2.orderDate).getTime() - new Date(order1.orderDate).getTime(),
    );
  }

  public async logout() {
    await this.authS.logout();
    await this.router.navigate(['']);
  }

  async showOrderModal(order: Order) {
    const modal = await this.modalController.create({
      component: OrderDetailsPage,
      cssClass: 'my-custom-class',
      componentProps: {
        order,
        user: this.user
      }
    });

    await modal.present();
  }

  public async changeStatus(order:Order, str:string, status:boolean) {
    switch(str){
      case 'payed': order.payed=status;
                    break;
      case 'ready': order.ready=status;
                    break;
      case 'pickedUp': order.pickedUp=status;
                    break;
    }

    await this.orderService.updateOrder(order).toPromise();
  }

  public filterOrders() {
    if(this.showPickedUp===true&&this.showPayed===false){
      this.orders = (this.ordersCopy.filter(obj => (obj.pickedUp === !this.showPickedUp)))
    }else if(this.showPayed===true&&this.showPickedUp===false){
      this.orders = this.ordersCopy.filter(obj => (obj.payed === !this.showPayed));
    }else if(this.showPickedUp===true&&this.showPayed===true){
      this.orders = this.ordersCopy.filter(obj => obj.payed === !this.showPayed && obj.pickedUp === !this.showPickedUp);
    }else{
      this.orders = this.ordersCopy;
    }
  }

  public changePickedUp() {
    this.showPayed=!this.showPayed;

    this.filterOrders();
  }

  public changePayed() {
    this.showPickedUp=!this.showPickedUp;

    this.filterOrders();
  }

  
  resetBadgeCount() {
    PushNotifications.removeAllDeliveredNotifications();
  }
}
