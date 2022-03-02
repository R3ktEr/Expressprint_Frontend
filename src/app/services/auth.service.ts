import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/definitions';
import { Platform } from '@ionic/angular';
import { _User } from '../model/User';
import { LocalStorageService } from './local-storage.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public gUser: any;
  private isAndroid = false;
  private loggedWithMail = false;

  constructor(private storage: LocalStorageService, private firebase: AngularFireAuth,
    private platform: Platform, private userService:UserService) {
    this.isAndroid = platform.is("android");
    
  }

  async singUpWithMail(userdata: any): Promise<any> {
    return new Promise(async (resolve,reject)=>{
      try{
        await this.firebase.createUserWithEmailAndPassword(userdata.email,
          userdata.password).then(response => {
            this.gUser = response.user;
          });
          this.loggedWithMail=true;

          let user: _User={
            googleId:this.gUser.uid,
            mail:this.gUser.email,
            name:"No name set",
            admin:false,
            disabled:false,
          }

          try{
            await this.checkDatabase(user);
            reject("El usuario ya existe en la base de datos") 
          }catch(notFound){
            let u=await this.userService.createUpdateUser(user).toPromise()
            console.log(u)
            await this.keepSession();
            resolve(u);
          }

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
        this.gUser = user;
      }
    }catch(err){
      console.log(err);
    }
  }

  public async login(userdata?): Promise<any>{
    return new Promise(async (resolve,reject)=>{
      
      if(!userdata){
        try{
          this.gUser=await GoogleAuth.signIn();

          console.log(this.gUser.id)
          console.log(this.gUser)

          let user: _User={
            googleId:this.gUser.id,
            mail:this.gUser.email,
            name:this.gUser.name,
            admin:false,
            disabled:false,
          }

          try{
            await this.checkDatabase(user);
            await this.keepSession();
          }catch(notFound){
            await this.keepSession();
            this.userService.createUpdateUser(user);
          }

          resolve(user);
        }catch(err){
          //console.log(err);
          reject(err);
        }
      }else{
        try{
          let u=await this.firebase.signInWithEmailAndPassword(userdata.email, userdata.password);
          this.gUser=u.user;

          let user: _User={
            googleId:this.gUser.id,
            mail:this.gUser.email,
            name:this.gUser.name,
            admin:false,
            disabled:false,
          }

          console.log(user)

          try{ 
            await this.checkDatabase(user);
            await this.keepSession(); //Solo si se encuentra el usuario en la base de datos del backend
          }catch(notFound){
            await this.userService.createUpdateUser(user); //Si no se encuentra el usuario en la base de datos del backend
            await this.keepSession();
          }

          resolve(user);
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
    await this.storage.setItem('user', JSON.stringify(this.gUser));
  }

  public isLoggedWithMail(): boolean {
    return this.loggedWithMail;
  }

  public isLogged(): boolean {
    if (this.gUser) return true; else return false;
  }

  public async checkDatabase(u:_User): Promise<_User | boolean> {
    return new Promise(async (resolve,reject)=>{
      try{
        let user:_User;
    
        this.userService.getUserByMail(u.mail).toPromise().then(data=>{
          user=data;
          
          resolve(user);    
        }).catch(data=>{
          reject(data);
        });
      }catch(err){
        reject(err)
      }
    });
  }
}
