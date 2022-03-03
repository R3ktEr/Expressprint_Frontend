import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public form:FormGroup
  public user:any;

  constructor(private router:Router, private fb:FormBuilder, private authS:AuthService, private notS:NotificationsService, 
    private navCtrl:NavController) { }

  ngOnInit() {
    this.form=this.fb.group({
      email:["", Validators.required],
      password:["",[Validators.required, Validators.minLength(6)]],
      repeatedPassword:["",[Validators.required, Validators.minLength(6)]]
    })
  }

  public async register(){
    let userdata={
      email: this.form.get("email").value,
      password: this.form.get("password").value,
      repeatedPassword: this.form.get("repeatedPassword").value
    }
    console.log(userdata)

    this.notS.presentLoading();

    if(userdata.password==userdata.repeatedPassword){
      try{
        let user=await this.authS.singUpWithMail(userdata);
        await this.notS.presentToast("Usuario registrado con exito", "success")
        this.navCtrl.navigateForward(['private/tabs/tab1',{user: JSON.stringify(user)}]);
        console.log(this.user);
      }catch(err){
        this.notS.presentToast("El correo introducido ya está siendo utilizado", "warning");
        console.log(err);
      }
    }else{
      this.notS.presentToast("Las contraseñas no coinciden", "danger");
    }

    this.notS.dismissLoading();
  }

  public goBack() {
    this.router.navigate(['/']);
  }
}
