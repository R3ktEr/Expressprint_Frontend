import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { Document } from 'src/app/model/Document';
import { Color, Copy, Ended, ImpressionPerSide, PricesRequest, Size, Thickness } from 'src/app/model/Products';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { PriceService } from 'src/app/services/prices.service';

@Component({
  selector: 'app-new-document',
  templateUrl: './new-document.page.html',
  styleUrls: ['./new-document.page.scss'],
})
export class NewDocumentPage implements OnInit {
  public formDocument:FormGroup
  private actualPrices:PricesRequest

  constructor(private fb:FormBuilder, private pricesService:PriceService, private notS:NotificationsService, private authS:AuthService, 
    private navCtrl:NavController, private modalController:ModalController, private storage: LocalStorageService) {
    this.formDocument=this.fb.group({
      ncopies:["", Validators.required],
      color:["", Validators.required],
      size:["", Validators.required],
      thickness:["", Validators.required],
      impressionType:["", Validators.required],
      impressionPerSide:["", Validators.required],
      orientation:["", Validators.required],
      ringedPosition:["", Validators.required],
      ended:["", Validators.required]
    })
    
  }

  ngOnInit() {
      
  }

  async ionViewWillEnter(){
    let temp=await this.pricesService.getAllPrices().toPromise();
    this.actualPrices=temp[0];
    console.log(this.actualPrices)

    let prices = 0;
    if (this.actualPrices.Copy) {
      this.actualPrices.Copy.forEach(value => {
        prices++;
      });
    }
    if (this.actualPrices.Color) {
      this.actualPrices.Color.forEach(value => {
        prices++;
      });
    }
    if (this.actualPrices.Thickness) {
      this.actualPrices.Thickness.forEach(value => {
        prices++;
      });
    }
    if (this.actualPrices.Endeds) {
      this.actualPrices.Endeds.forEach(value => {
        prices++;
      });
    }
    if (this.actualPrices.ImpressionPerSide) {
      this.actualPrices.ImpressionPerSide.forEach(value => {
        prices++;
      });
    }
    if (this.actualPrices.Sizes) {
      this.actualPrices.Sizes.forEach(value => {
        prices++;
      });
    }
    if (prices !== 18) {
      //Hay que cambiarlo
      await this.navCtrl.navigateForward(['private/tabs/tab1', {precios: 'No hay precios en la base de datos'}]);
    }
  }

  public async saveOrder(){
    //Copy, Color, Size, Thickness, Ended, ImpressionPerSide

    /**
     * Tener en cuenta que si una de las lista de precios devuelta por la base de datos está vacia o parcialmente incompleta
     * a la hora de crear el newDocument va a reventar o va a provocar un bad request a la hora de subirlo
     */
    
    if(await this.notS.presentAlertConfirm("Confirmacion", "¿Confirma que los datos introducidos son correctos?", "Si", "No")){

      await this.notS.presentLoading()
      
      let copy:Copy=this.actualPrices.Copy[0];
      let color:Color=this.actualPrices.Color.filter(c=>String(c.isColor)===this.formDocument.get("color").value)[0];
      let sizes:Size=this.actualPrices.Sizes.filter(s=>s.sheetSize===this.formDocument.get("size").value)[0];
      let thickness:Thickness=this.actualPrices.Thickness.filter(t=>t.thicknessType===this.formDocument.get("thickness").value)[0];
      let ended:Ended=this.actualPrices.Endeds.filter(e=>e.endedType===this.formDocument.get("ended").value)[0];
      let impressionPerSide:ImpressionPerSide=this.actualPrices.ImpressionPerSide.filter(i=>i.impressionsTypes===this.formDocument.get("impressionPerSide").value)[0];
  
      let newDocument:Document={
        copyPrice:copy,
        nCopies:this.formDocument.get("ncopies").value,
        isColor:color,
        sizes:sizes,
        thickness:thickness,
        isTwoSides:this.formDocument.get("impressionType").value,
        impressionPerSide:impressionPerSide,
        isVertical:this.formDocument.get("orientation").value,
        ringedPosition:this.formDocument.get("ringedPosition").value,
        finishType:ended
  
        //Order
        //Comment
        //url
      }
  
      console.log(newDocument)
  
      //console.log(new Date().toLocaleString())
  
      //console.log(formatDate(Date.now(), "YYYY-MM-ddTHH:mm:SS", this.locale))
  
      //console.log(await this.authS.loadSession())
  
      await this.notS.dismissLoading()
  
      this.modalController.dismiss(newDocument);
    }
  }

  public async closeModal(){
    if(await this.notS.presentAlertConfirm("Descartar Documento", "¿Está seguro de que quiere descartar el documento actual?", "Si", "No")) {
      this.modalController.dismiss();
    }
  }
}
