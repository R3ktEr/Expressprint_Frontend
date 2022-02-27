import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private router:Router, private fb:FormBuilder, private authS:AuthService, private notS:NotificationsService) { }

  ngOnInit() {
    this.form=this.fb.group({
      email:["", Validators.required],
      password:["",Validators.required],
      repeatedPassword:["",Validators.required]
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
        this.router.navigate(['private/tabs/tab1']);
        console.log(this.user);
      }catch(err){
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
