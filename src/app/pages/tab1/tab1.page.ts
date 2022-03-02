import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/model/Order';
import { _User } from 'src/app/model/User';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public user:_User;
  private datacoming:any;

  constructor(private route:ActivatedRoute, private orderService:OrderService) {
    this.datacoming=this.route.snapshot.params['user'];
    if(this.datacoming){
      try{
        this.user=JSON.parse(this.datacoming);
        console.log(this.user)
      }catch(err){
        //console.log(err);
      }
    }
  }

  public getOrders():void{ 
    this.orderService.getAllOrders().subscribe(response=>{
      let orders:Order[]
      orders=response

      for(let i=0; i<orders.length; i++){
        console.log(orders[i])
      }
    })
  }
}
