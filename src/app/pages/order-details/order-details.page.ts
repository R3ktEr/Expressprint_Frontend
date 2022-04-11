import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Order } from 'src/app/model/Order';
import { _User } from 'src/app/model/User';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  @Input() order:Order;
  @Input() user:_User;

  constructor(private modalController:ModalController) { }

  ngOnInit() {
    console.log(this.order)
  }

  public closeModal(){
    this.modalController.dismiss();
  }
}
