import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { _User } from 'src/app/model/User';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ViewChild } from '@angular/core';
import { IonDatetime, ModalController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { NewDocumentPage } from '../new-document/new-document.page';
import { Order } from 'src/app/model/Order';
import { formatDate } from '@angular/common';
import { Document } from 'src/app/model/Document';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  @ViewChild(IonDatetime)
  public datetime: IonDatetime;
  
  public order:Order;
  public user:_User;

  private pickupDate:string;
  private orderDate:string;
  private date:string;

  public dateTime:string;
  public userDocuments:Document[];
  public finalPrice:number;

  constructor(private authS:AuthService, private notS:NotificationsService, private modalController: ModalController, 
    @Inject(LOCALE_ID) private locale: string, private orderService:OrderService) {
    this.userDocuments=new Array()
    this.finalPrice=0;
    this.pickupDate="";
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.notS.presentLoading();

    this.user=await this.authS.loadSession();

    this.orderDate=formatDate(Date.now(), "YYYY-MM-ddTHH:mm:SS", this.locale)

    await this.notS.dismissLoading();
  }

  private calculateFinalPrice() {
    this.userDocuments.forEach(document => {
      this.finalPrice+=document.copyPrice.price*document.nCopies; //nCopies debe de sacarlo de los metadatos del documento
      this.finalPrice+=document.finishType.price;
      this.finalPrice+=document.impressionPerSide.price;
      this.finalPrice+=document.isColor.price;
      this.finalPrice+=document.sizes.price;
      this.finalPrice+=document.thickness.price;
    });

    this.finalPrice=Math.round((this.finalPrice + Number.EPSILON) * 100) / 100;
  }

  async formatDate(value: string) {
    console.log(value)
    this.pickupDate=formatDate(Date.now(), "YYYY-MM-ddTHH:mm:ss", this.locale)
    this.date= format(parseISO(value), 'dd-MM-yyyy HH:mm');

    console.log(this.pickupDate)
  }

  async addOrderModal() {
    const modal = await this.modalController.create({
      component: NewDocumentPage,
      cssClass: 'my-custom-class',
      componentProps: {
        
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        let document:Document= data['data'];

        if(document){
          this.userDocuments.push(document)
        }
      
        this.calculateFinalPrice()
    });

    await modal.present();
  }

  async confirmOrder() {
    if(await this.notS.presentAlertConfirm("Confirmacion", "¿Confirmar pedido?", "Si", "No")){
      //Crear el objeto order y subirlo a la base de datos
      let order:Order={
        finalPrice:this.finalPrice,
        orderDate:this.orderDate,
        payed:false,
        pickedUp:false,
        pickupDate:this.pickupDate,
        ready:false,
        user:this.user,
        documents:this.userDocuments
      }

      console.log(order)

      await this.orderService.createOrder(order).toPromise()

      console.log("Pedido subido")
    }
  }
}
