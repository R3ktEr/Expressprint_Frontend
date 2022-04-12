import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';
import {Platform} from '@ionic/angular';
import {_User} from '../model/User';
import {LocalStorageService} from './local-storage.service';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public gUser: any;
  private isAndroid = false;
  private loggedWithMail = false;

  constructor(private storage: LocalStorageService, private firebase: AngularFireAuth,
    private platform: Platform, private userService: UserService) {
    this.isAndroid = platform.is('android');

  }

  async singUpWithMail(userdata: any): Promise<any> {
    return new Promise(async (resolve,reject)=>{
      try{
        await this.firebase.createUserWithEmailAndPassword(userdata.email,
          userdata.password).then(response => {
            this.gUser = response.user;
            console.log(this.gUser);
          });
          this.loggedWithMail=true;

          const user: _User={
            googleId:this.gUser.uid,
            mail:this.gUser.email,
            name:'No name set',
            admin:false,
            disabled:false,
          };

          this.gUser = user;

          try{
            this.gUser = await this.checkDatabase(user);
            reject('El usuario ya existe en la base de datos');
          }catch(notFound){
            this.gUser = await this.userService.createUpdateUser(user).toPromise();
            console.log(this.gUser);
            await this.keepSession();
            resolve(this.gUser);
          }

      }catch(err){
        reject(err);
      }
    });
  }

  public async loadSession(): Promise<_User> {
    try{
      const u = await this.storage.getItem('user');

      if (u) {
        const user = JSON.parse(u);
        this.gUser = user;
        return user;
      }
    }catch(err){
      console.log(err);
    }
  }

  public async login(userdata?): Promise<_User>{
    return new Promise(async (resolve,reject)=>{

      if(!userdata){
        try{
          this.gUser=await GoogleAuth.signIn();
          this.gUser = {
            googleId: this.gUser.id,
            mail: this.gUser.email,
            name: this.gUser.name,
            admin: false,
            disabled: false,
          };
          try{
            this.gUser = await this.checkDatabase(this.gUser);
            await this.keepSession();
          }catch(notFound){
            await this.keepSession();
            this.userService.createUpdateUser(this.gUser);
          }

          resolve(this.gUser);
        }catch(err){
          //console.log(err);
          reject(err);
        }
      }else{
        try{
          const u=await this.firebase.signInWithEmailAndPassword(userdata.email, userdata.password);

          const user: _User={
            googleId:u.user.uid,
            mail:u.user.email,
            name:'No Name Set',
            admin:false,
            disabled:false,
          };

          console.log(user);
          this.gUser = user;
          try{
            this.gUser = await this.checkDatabase(user);
            await this.keepSession(); //Solo si se encuentra el usuario en la base de datos del backend
          }catch(notFound){
            //Si no se encuentra el usuario en la base de datos del backend
            this.gUser = await this.userService.createUpdateUser(this.gUser);
            await this.keepSession();
          }

          resolve(this.gUser);
        }catch(err){
          reject(err);
        }
      }
    });
  }

  public async logout() {
    if(!this.loggedWithMail){
      try{
        await GoogleAuth.signOut();
      }catch(err){
        console.log(err);
      }
    }else{
      try{
        await this.firebase.signOut();
      }catch(err){
        console.log(err);
      }
    }

    await this.storage.removeItem('user');
    this.gUser = null;
  }

  public async keepSession() {
    delete this.gUser.userOrders;
    await this.storage.setItem('user', JSON.stringify(this.gUser));
  }

  public isLoggedWithMail(): boolean {
    return this.loggedWithMail;
  }

  public isLogged(): boolean {
    return !!this.gUser;
  }

  public async checkDatabase(u: _User): Promise<_User>{
    return this.userService.getUserByMail(u.mail).toPromise();
  }

}
