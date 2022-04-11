import { Component, OnInit } from '@angular/core';
import { PriceService } from 'src/app/services/prices.service';
import {PricesRequest} from '../../model/Products';
import {AuthService} from '../../services/auth.service';
import {_User} from '../../model/User';

@Component({
  selector: 'app-price',
  templateUrl: './prices.page.html',
  styleUrls: ['./prices.page.scss'],
})
export class PricesPage implements OnInit {

  public prices: PricesRequest;
  public isAdmin: boolean;
  private user: _User;

  constructor(private priceService: PriceService, private authS: AuthService) { }

  ngOnInit() {
    this.getPrices();
  }

  async ionViewWillEnter() {
    this.user = await this.authS.loadSession();
    this.isAdmin = this.user.admin;
  }

  public getPrices() {
    this.priceService.getAllPrices().forEach(value => {
      value.forEach(value1 => {
        this.prices = value1;
      });
    });
  }

  public sendNewPrices(){

  }

}
