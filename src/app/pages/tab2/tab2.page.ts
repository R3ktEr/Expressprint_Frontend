import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { _User } from 'src/app/model/User';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ViewChild } from '@angular/core';
import { IonDatetime, ModalController, NavController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { NewDocumentPage } from '../new-document/new-document.page';
import { Order } from 'src/app/model/Order';
import { formatDate } from '@angular/common';
import { Document } from 'src/app/model/Document';
import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';
import { PriceService } from 'src/app/services/prices.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild(IonDatetime)
  public datetime: IonDatetime;

  public order: Order;
  public user: _User;

  public pickupDate: string;
  public dateTime: string;
  public date: string;
  public userDocuments: Document[];
  public finalPrice: number;
  private orderDate: string;
  private formData: FormData = new FormData();


  constructor(private authS: AuthService, private notS: NotificationsService, private modalController: ModalController,
              @Inject(LOCALE_ID) private locale: string, private orderService: OrderService, private router: Router,
              private pricesService:PriceService, private navCtrl:NavController) {
    this.userDocuments = [];
    this.finalPrice = 0;
    this.pickupDate = '';
  }

  async ngOnInit() {
    
  }

  async ionViewWillEnter() {
    await this.notS.presentLoading();
    var actualPrices = (await this.pricesService.getAllPrices().toPromise())[0];

    this.user = await this.authS.loadSession();

    this.orderDate = formatDate(Date.now(), 'YYYY-MM-ddTHH:mm:ss', this.locale);

    if(actualPrices.Color == null || actualPrices.Copy == null || actualPrices.Endeds == null || actualPrices.ImpressionPerSide == null ||
      actualPrices.Sizes == null || actualPrices.Thickness == null ){
      await this.navCtrl.navigateForward(['private/tabs/tab1']);
      await this.notS.presentToast("Error: No hay un listado de precios definidos en la base de datos", "danger")
    }

    await this.notS.dismissLoading();
  }

  async formatDate(value: string) {
    this.pickupDate = formatDate(value, 'YYYY-MM-ddTHH:mm:ss', this.locale)
    this.date = format(parseISO(value), 'dd-MM-yyyy HH:mm');
  }

  async addOrderModal() {
    const modal = await this.modalController.create({
      component: NewDocumentPage,
      cssClass: 'my-custom-class',
      componentProps: {}
    });

    modal.onDidDismiss()
      .then((data) => {
        if(data.data){
          const d = data.data;

          const document: Document = d[0];
          const formData: FormData = d[1];

          this.formData.append('files', formData.get('files'));
          if (document) {
            this.userDocuments.push(document);
          }
          this.calculateFinalPrice();
        }
      });

    await modal.present();
  }

  async confirmOrder() {
    if(await this.notS.presentAlertConfirm('Confirmacion', '¿Confirmar pedido?', 'Si', 'No')){
      await this.notS.presentLoading();

      const order: Order={
        finalPrice:this.finalPrice,
        orderDate:this.orderDate,
        payed:false,
        pickedUp:false,
        pickupDate:this.pickupDate,
        ready:false,
        user:this.user,
        documents:this.userDocuments
      };

      const documentLinks= await this.orderService.uploadDocument(this.formData, this.user.name, this.user.mail).toPromise();

      let links: string[];

      Object.keys(documentLinks).forEach(key=>{
        links=documentLinks[key];
      });

      links.forEach((value) => {
        let i = 0;

        this.userDocuments[i].url = value;
        i++;
      });

      const orderUploaded = await this.orderService.createOrder(order).toPromise();

      this.userDocuments = [];
      this.finalPrice = 0;
      this.dateTime = '';
      this.date=null;

      await this.notS.dismissLoading();

      await this.notS.presentToast('¡Pedido realizado!', 'success');

      await this.router.navigate(['private/tabs/tab1']);
    }
  }

  private calculateFinalPrice() {
    this.userDocuments.forEach(document => {
      this.finalPrice += document.copyPrice.price * document.nCopies; //nCopies debe de sacarlo de los metadatos del documento
      this.finalPrice += document.finishType.price;
      this.finalPrice += document.impressionPerSide.price;
      this.finalPrice += document.isColor.price;
      this.finalPrice += document.size.price;
      this.finalPrice += document.thickness.price;
    });

    this.finalPrice = Math.round((this.finalPrice + Number.EPSILON) * 100) / 100;
  }

  public async discardOrder() {
    var confirmation = await this.notS.presentAlertConfirm("Descartar pedido", "¿Confirmas que quieres descartar este pedido?", "Si", "No")

    if(confirmation){
      this.userDocuments = [];
      this.finalPrice = 0;
      this.dateTime = '';
      this.date=null;

      this.notS.presentToast("¡Pedido descartado!", "success");
      await this.navCtrl.navigateForward(['private/tabs/tab1']);
    }
  }
}
