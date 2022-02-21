import { Component } from '@angular/core';
import { Order } from 'src/app/model/Order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private orderService:OrderService) {}

  public getOrders():void{ 
    this.orderService.getAllOrders().then(response=>{
      let orders:Order[]
      orders=response

      for(let i=0; i<orders.length; i++){
        console.log(orders[i])
      }
    })
  }
}
