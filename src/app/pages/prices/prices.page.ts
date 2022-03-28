import { Component, OnInit } from '@angular/core';
import { PriceService } from 'src/app/services/prices.service';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.page.html',
  styleUrls: ['./prices.page.scss'],
})
export class PricesPage implements OnInit {

  constructor(private priceService:PriceService) { }

  ngOnInit() {
  }

  public async getPrices() {
    var prices=await this.priceService.getAllPrices();

    console.log(prices);
  }

}
