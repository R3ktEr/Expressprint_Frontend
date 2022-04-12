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

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public user: _User;
  public isAdmin: boolean;
  public orders: Order[];
  private ordersCopy: Order[];
  private subscription: Subscription;
  private readonly dataIncoming: any;
  private filter: any;
  private readonly noPrices: string;

  constructor(private orderService: OrderService, private authS: AuthService, private router: Router, private navController: NavController,
              private route: ActivatedRoute, private localstorage: LocalStorageService, private notS: NotificationsService,
              private modalController: ModalController,) {
    this.ordersCopy = [];
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
      console.log(err)
    }
  }

  async ionViewWillEnter() {
    this.user=await this.authS.loadSession();
    this.isAdmin=this.user.admin;

    if (this.isAdmin) {
      this.getAllOrders();
      if(this.noPrices){
        await this.notS.presentToast(this.noPrices,'danger');
      }
    } else {
      await this.notS.presentLoading()
      this.getOrders();
      await this.notS.dismissLoading()
    }
  }

  public getOrders(): void {
    console.log(this.user);
    this.subscription = this.orderService.getOrdersByUser(this.user.id).subscribe(value => {
      this.orders = value;
      this.ordersCopy = [];
      this.orders.forEach(values => {
        this.ordersCopy.push(values);
      });
    });
  }

  public getAllOrders(): void {
    this.subscription = this.orderService.getAllOrders().pipe(map(value => value.map(c => ({key: c.id, ...c})))).subscribe(value => {
      this.orders = value;
      this.ordersCopy = [];
      this.orders.forEach(values => {
        this.ordersCopy.push(values);
      });
    });
  }

  public async logout() {
    await this.authS.logout();
    await this.router.navigate(['']);
  }

  public showOnly(event?, type?: string) {
    if (type === 'NotDelivered') {
      this.filter.pickedUp = event.detail.checked;
    }
    if (type === 'NotPayed') {
      this.filter.payed = event.detail.checked;
    }
    if(this.filter.payed === true || this.filter.pickedUp === true) {
      this.orders = this.ordersCopy.filter(obj => obj.payed === this.filter.payed && obj.pickedUp === this.filter.pickedUp);
    }else{
      this.orders = this.ordersCopy;
    }
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
}
