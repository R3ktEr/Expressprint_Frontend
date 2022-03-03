import {Component} from '@angular/core';
import {Order} from 'src/app/model/Order';
import {OrderService} from 'src/app/services/order.service';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {_User} from '../../model/User';
import {NavController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {LocalStorageService} from '../../services/local-storage.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public orders: Order[];
  private ordersCopy: Order[];
  private subscription: Subscription;
  private dataIncoming: any;
  public user: _User;
  public isAdmin: boolean;
  private filter: any;

  constructor(private orderService: OrderService, private authS: AuthService, private router: Router,
              private navController: NavController, private route: ActivatedRoute, private localstorage: LocalStorageService) {
    
    this.ordersCopy = [];
    this.filter = {
      payed: false,
      pickedUp: false
    };

    try{
      this.dataIncoming=this.route.snapshot.params.user;

      if(this.dataIncoming){
        this.user=this.dataIncoming;
        this.isAdmin=this.user.admin;
      }
    }catch(err){
      //console.log(err)
    }
  }

  async ionViewWillEnter() {
    this.user=await this.authS.loadSession()
    this.isAdmin=this.user.admin;

    if (this.isAdmin) {
      this.getAllOrders();
    } else {
      this.getOrders();
    }
  }

  public getOrders(): void {
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

  public viewOrder(order: Order): void {
    this.navController.navigateForward(['private/tabs/tab3', {data: JSON.stringify(order)}]);
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

}
