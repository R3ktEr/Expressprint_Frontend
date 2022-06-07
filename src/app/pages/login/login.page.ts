import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {GoogleAuth, User} from '@codetrix-studio/capacitor-google-auth';
import {NavController, Platform} from '@ionic/angular';
import {_User} from 'src/app/model/User';
import {AuthService} from 'src/app/services/auth.service';
import {NotificationsService} from 'src/app/services/notifications.service';
import {getAuth} from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public userinfo: User;
  public form: FormGroup;
  private isAndroid: boolean;

  constructor(private platform: Platform, private authS: AuthService, private router: Router, private fb: FormBuilder,
              private notS: NotificationsService, private navCtrl: NavController) {
    this.isAndroid = this.platform.is('android');
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async ngOnInit() {
    try {
      await this.authS.loadSession();
    } catch (err) {
      console.log(err);
    }

    if (this.authS.isLogged()) {
      await this.navCtrl.navigateForward(['private/tabs/tab1', {user: JSON.stringify(this.authS.gUser)}]);
    }
  }

  ionViewWillEnter() {
    let user: _User;
    this.platform.ready().then(async () => {
      await GoogleAuth.initialize(); //lee la config clientid del meta de index.html
      await this.authS.loadSession();
    });
  }

  public async signin() {

    try {
      this.notS.presentLoading();
      const user: _User = await this.authS.login();
      this.notS.dismissLoading();

      await this.navCtrl.navigateForward(['private/tabs/tab1', {user: JSON.stringify(user)}]);

      this.notS.presentToast("Sesion iniciada con exito", "success")
    } catch (err) {
      this.notS.dismissLoading();
      this.notS.presentToast("Error al iniciar sesion", "danger")
      console.error(err);
    }
  }

  public register() {
    this.router.navigate(['register']);
  }

  public async loginWithMail() {
    const auth = getAuth();

    const userdata = {
      email: this.form.get('email').value,
      password: this.form.get('password').value
    };

    await this.notS.presentLoading();

    try {
      const user: _User = await this.authS.login(userdata);
      if (auth.currentUser.emailVerified === true) {
        await this.navCtrl.navigateForward(['private/tabs/tab1', {user: JSON.stringify(user), tab: 'login'}]);
      } else {
        await this.notS.presentToast('Usuario no verificado', 'warning');
        await this.router.navigate(['']);
      }

    } catch (err) {
      await this.notS.presentToast('Contraseña incorrecta', 'danger');
    }

    await this.notS.dismissLoading();
  }

}
