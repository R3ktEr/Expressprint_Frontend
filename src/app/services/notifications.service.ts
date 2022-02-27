import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private miLoading:HTMLIonLoadingElement;
  private loadingInUse:boolean;

  constructor(private loading:LoadingController, private toast: ToastController, private alert:AlertController) { 
    this.loadingInUse=false;
  }

  async presentLoading():Promise<void> {
    if(this.loadingInUse)
    this.dismissLoading();

    this.miLoading = await this.loading.create({
      message: '', 
    });
    await this.miLoading.present();
    this.loadingInUse=true;
  }

  async dismissLoading():Promise<void>{
    await this.miLoading.dismiss();
    this.loadingInUse=false;
  }

  async presentToast(msg:string, clr:string):Promise<void> {
    const miToast = await this.toast.create({
      message: msg,
      duration: 2000,
      color: clr,
      animated: true
    });

    miToast.present();
  }

  async presentAlertConfirm(header:string, message:string, btnYes:string, btnNo:string):Promise<boolean> {
    let choice:boolean;

    const alert = await this.alert.create({
      header: header,
      message: message,
      buttons: [
        {
          text: btnNo,
          role: 'cancel',
          handler: () => {
            choice=false;
          }
        }, {
          text: btnYes,
          handler: () => {
            choice=true;
          }
        }
      ]
    });

    await alert.present();
    
    await alert.onDidDismiss()

    return choice;
  }
}
