import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleAuth, User } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public userinfo:User;
  private isAndroid:boolean;
  public form:FormGroup

  constructor(private platform:Platform, private authS:AuthService, private router:Router, private fb:FormBuilder, 
    private notS:NotificationsService) {
    this.isAndroid=this.platform.is("android");
    this.form=this.fb.group({
      email:["", Validators.required],
      password:["",Validators.required]
    })
  }

  async ngOnInit() {
    try{
      await this.authS.loadSession();
    }catch(err){
      console.log(err)
    }

    if(this.authS.isLogged()){
      this.router.navigate(['private/tabs/tab1']);
    }
  }

  ionViewWillEnter(){
    this.platform.ready().then(async()=>{
      await GoogleAuth.initialize(); //lee la config clientid del meta de index.html
      await this.authS.loadSession();
    })
  
    if(this.authS.isLogged()){
      this.router.navigate(['private/tabs/tab1']);
    }
  }

  public async signin(){
    try {
      await this.authS.login();
      //this.router.navigate(['private/tabs/tab1']);
      console.log("Navega")
    } catch (err) {
      console.error(err);
    }
  }

  public register(){
    this.router.navigate(['register']);
  }

  public async loginWithMail() {
    let userdata={
      email: this.form.get("email").value,
      password: this.form.get("password").value
    }
    
    await this.notS.presentLoading();

    try{
      await this.authS.login(userdata);
      this.router.navigate(['private/tabs/tab1']);
    }catch(err){
      this.notS.presentToast("Contraseña incorrecta", "danger");
    }

    await this.notS.dismissLoading();
  }

}
