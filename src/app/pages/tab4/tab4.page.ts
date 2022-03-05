import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Document } from 'src/app/model/Document';
import { Color, Copy, Ended, ImpressionPerSide, PricesRequest, Size, Thickness } from 'src/app/model/Products';
import { NotificationsService } from 'src/app/services/notifications.service';
import { PriceService } from 'src/app/services/prices.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  public formOrder:FormGroup
  private actualPrices:PricesRequest

  constructor(private fb:FormBuilder, private pricesService:PriceService, private notS:NotificationsService) {
    this.formOrder=this.fb.group({
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
  }

  public async saveOrder(){
    //Copy, Color, Size, Thickness, Ended, ImpressionPerSide

    /**
     * Tener en cuenta que si una de las lista de precios devuelta por la base de datos está vacia o parcialmente incompleta
     * a la hora de crear el newDocument va a reventar o va a provocar un bad request a la hora de subirlo
     */
    await this.notS.presentLoading()

    let copy:Copy=this.actualPrices.Copy[0];
    let color:Color=this.actualPrices.Color.filter(c=>String(c.isColor)===this.formOrder.get("color").value)[0];
    let size:Size=this.actualPrices.Sizes.filter(s=>s.sheetSize===this.formOrder.get("size").value)[0];
    let thickness:Thickness=this.actualPrices.Thickness.filter(t=>t.thicknessType===this.formOrder.get("thickness").value)[0];
    let ended:Ended=this.actualPrices.Endeds.filter(e=>e.endedType===this.formOrder.get("ended").value)[0];
    let impressionPerSide:ImpressionPerSide=this.actualPrices.ImpressionPerSide.filter(i=>i.impressionsTypes===this.formOrder.get("impressionPerSide").value)[0];

    let newDocument:Document={
      copyPrice:copy,
      nCopies:this.formOrder.get("ncopies").value,
      isColor:color,
      size:size,
      thickness:thickness,
      isTwoSides:this.formOrder.get("impressionType").value,
      impressionPerSide:impressionPerSide,
      isVertical:this.formOrder.get("orientation").value,
      ringedPosition:this.formOrder.get("ringedPosition").value,
      finishType:ended
    }

    console.log(newDocument)

    await this.notS.dismissLoading()
  }
}
