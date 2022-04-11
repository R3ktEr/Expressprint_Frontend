import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Document } from 'src/app/model/Document';
import { Color, Copy, Ended, ImpressionPerSide, PricesRequest, Size, Thickness } from 'src/app/model/Products';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { PriceService } from 'src/app/services/prices.service';
import { Plugins } from '@capacitor/core';
const { FileSelector } = Plugins;
//import 'capacitor-file-selector';//TODO: Comentar antes de buildear en android
import { OrderService } from 'src/app/services/order.service';


@Component({
  selector: 'app-new-document',
  templateUrl: './new-document.page.html',
  styleUrls: ['./new-document.page.scss'],
})
export class NewDocumentPage implements OnInit {
  public formDocument: FormGroup;
  public docName: string;
  private actualPrices: PricesRequest;
  private formData: FormData;

  constructor(private fb: FormBuilder, private pricesService: PriceService, private notS: NotificationsService, private authS: AuthService,
    private navCtrl: NavController, private modalController: ModalController, private storage: LocalStorageService, private platform: Platform,
    private orderService: OrderService) {
    this.formDocument=this.fb.group({
      ncopies:['', Validators.required],
      color:['', Validators.required],
      size:['', Validators.required],
      thickness:['', Validators.required],
      impressionType:['', Validators.required],
      impressionPerSide:['', Validators.required],
      orientation:['', Validators.required],
      ringedPosition:['', Validators.required],
      ended:['', Validators.required]
    });

  }

  ngOnInit() {

  }

  async ionViewWillEnter(){
    this.actualPrices=(await this.pricesService.getAllPrices().toPromise())[0];
    console.log(this.actualPrices);

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

    if(await this.notS.presentAlertConfirm('Confirmacion', '¿Confirma que los datos introducidos son correctos?', 'Si', 'No')){

      await this.notS.presentLoading();

      const copy: Copy=this.actualPrices.Copy[0];
      const color: Color=this.actualPrices.Color.filter(c=>String(c.isColor)===this.formDocument.get('color').value)[0];
      const sizes: Size=this.actualPrices.Sizes.filter(s=>s.sizeOfSheet===this.formDocument.get('size').value)[0];
      const thickness: Thickness=this.actualPrices.Thickness.filter(t=>t.thicknessType===this.formDocument.get('thickness').value)[0];
      const ended: Ended=this.actualPrices.Endeds.filter(e=>e.endedType===this.formDocument.get('ended').value)[0];
      const impressionPerSide: ImpressionPerSide=this.actualPrices.ImpressionPerSide.filter(i=>i.impressionsTypes===this.formDocument.get('impressionPerSide').value)[0];

      const newDocument: Document={
        copyPrice:copy,
        nCopies:this.formDocument.get('ncopies').value,
        isColor:color,
        sizes,
        thickness,
        isTwoSides:this.formDocument.get('impressionType').value,
        impressionPerSide,
        isVertical:this.formDocument.get('orientation').value,
        ringedPosition:this.formDocument.get('ringedPosition').value,
        finishType:ended,

        //Order
        //Comment
        //url
      };

      console.log(newDocument);

      //console.log(new Date().toLocaleString())

      //console.log(formatDate(Date.now(), "YYYY-MM-ddTHH:mm:SS", this.locale))

      //console.log(await this.authS.loadSession())

      await this.notS.dismissLoading();

      await this.modalController.dismiss([newDocument, this.formData]);
    }
  }

  public async closeModal(){
    if(await this.notS.presentAlertConfirm('Descartar Documento', '¿Está seguro de que quiere descartar el documento actual?', 'Si', 'No')) {
      await this.modalController.dismiss();
    }
  }

  async select()
  {
    const multipleSelection = false;
    //let ext = [".jpg",".png",".pdf",".jpeg"] // list of extensions
    //let ext = ["MP3", "ImaGes"] // combination of extensions or category
    //let ext = ["videos", "audios", "images"] // list of all category
    let ext = ['*']; // Allow any file type
    ext = ext.map(v => v.toLowerCase());
    const formData = new FormData();
    const selectedFile = await FileSelector.fileSelector({
      multiple_selection: multipleSelection,
      ext
    });

    if(this.platform.is('android')) {
      const paths = JSON.parse(selectedFile.paths);
      const originalNames = JSON.parse(selectedFile.original_names);
      const extensions = JSON.parse(selectedFile.extensions);
      for (let index = 0; index < paths.length; index++) {
          const file = await fetch(paths[index]).then((r) => r.blob());
          formData.append('files', file, originalNames[index] + extensions[index]);

          this.docName=originalNames[index];
        }

        this.formData=formData;
    } else if(this.platform.is('ios')) {
      for (let index = 0; index < selectedFile.paths.length; index++) {
        const file = await fetch(selectedFile.paths[index]).then((r) => r.blob());
        formData.append('files', file, selectedFile.original_names[index] + selectedFile.extensions[index]);
      }
    }
    else
    {
      FileSelector.addListener('onFilesSelected', async (data: FileList) => {
            for(let i = 0; i < data.length; i++)
            {
              formData.append(
                'files', //param del endpoint del back
                data.item(i),
                data.item(i).name
              );

              this.docName=data.item(i).name;
            }
            this.formData=formData;
        });
    }
  }
}
