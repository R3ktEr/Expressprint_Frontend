import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/definitions';
import { Platform } from '@ionic/angular';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: any;
  private isAndroid = false;
  private loggedWithMail = false;

  constructor(private storage: LocalStorageService, private firebase: AngularFireAuth,
    private platform: Platform) {
    this.isAndroid = platform.is("android");
    
  }

  async singUpWithMail(userdata: any): Promise<any> {
    return new Promise(async (resolve,reject)=>{
      try{
        await this.firebase.createUserWithEmailAndPassword(userdata.email,
          userdata.password).then(response => {
            this.user = response.user;
          });
          this.loggedWithMail=true;
          await this.keepSession();
          resolve(this.user);
      }catch(err){
        reject(err);
      }
    });
  }

  public async loadSession() {
    try{
      let user = await this.storage.getItem('user');
      if (user) {
        user = JSON.parse(user);
        this.user = user;
      }
    }catch(err){
      console.log(err);
    }
  }

  public async login(userdata?): Promise<any>{
    return new Promise(async (resolve,reject)=>{
      let user: User;
  
      if(!userdata){
        try{
          user= await GoogleAuth.signIn();
          this.user = user;
          console.log(user)
          await this.keepSession();
          resolve(true);
        }catch(err){
          //console.log(err);
          reject(err);
        }
      }else{
        try{
          let u=await this.firebase.signInWithEmailAndPassword(userdata.email, userdata.password);
          this.user=u.user;
          await this.keepSession();
          resolve(true);
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
    this.user = null;
  }

  public async keepSession() {
    await this.storage.setItem('user', JSON.stringify(this.user));
  }

  public isLoggedWithMail(): boolean {
    return this.loggedWithMail;
  }

  public isLogged(): boolean {
    if (this.user) return true; else return false;
  }
}
