import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import {AuthService} from 'src/app/services/auth.service';
import {NotificationsService} from 'src/app/services/notifications.service';
import {getAuth, sendEmailVerification} from 'firebase/auth';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public form: FormGroup;
  public user: any;
  public isUserEmailVerified: boolean;

  constructor(private router: Router, private fb: FormBuilder, private authS: AuthService, private notS: NotificationsService,
              private navCtrl: NavController) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatedPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  public async register() {
    const auth = getAuth();
    const userdata = {
      email: this.form.get('email').value,
      password: this.form.get('password').value,
      repeatedPassword: this.form.get('repeatedPassword').value
    };


    await this.notS.presentLoading();

    if (userdata.password === userdata.repeatedPassword) {
      try {
        const user = await this.authS.singUpWithMail(userdata);

        await this.notS.presentToast('Usuario registrado con exito', 'success');

        this.navCtrl.navigateBack(['private/tabs/tab1', {user: JSON.stringify(user)}]);
      } catch (err) {
        await this.notS.presentToast('El correo introducido ya está siendo utilizado', 'warning');
        console.log(err);
      }
    } else {
      await this.notS.presentToast('Las contraseñas no coinciden', 'danger');
    }

    await this.notS.dismissLoading();
  }

  public goBack() {
    this.router.navigate(['/']);
  }

}
