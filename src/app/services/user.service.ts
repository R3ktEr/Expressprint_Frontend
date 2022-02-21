import { Injectable } from '@angular/core';
import {User} from '../model/User';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { resolve } from 'dns';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http:HTTP) { }


  public  addUser(user:User):Promise<User[]>{
    return new Promise((resolve, reject)=>{
      this.http.get("http://localhost:8080/user", {}, {}).then(response=>{
        try{
          console.log(response)

          let users:User[]=JSON.parse(response.data)
          
          resolve(users)
        }catch(err){
          reject(err)
        }
      })
    })
  }

  public getUserByMail(all?):Promise<User[]>{
    return new Promise((resolve, reject)=>{
      this.http.get("http://localhost:8080/user", {}, {}).then(response=>{
        try{
          console.log(response)

          let users:User[]=JSON.parse(response.data)
          
          resolve(users)
        }catch(err){
          reject(err)
        }
      })
    })
  }

  public async getUsers():Promise<User[]>{
    
    return new Promise((resolve, reject)=>{
      this.http.get("http://localhost:8080/user", {}, {}).then(response=>{
        try{
          console.log(response)

          let users:User[]=JSON.parse(response.data)
          
          resolve(users)
        }catch(err){
          reject(err)
        }
      })
    })


   
  }

  public deleteUser(id:number):Promise<User[]>{
    let find:boolean=false;

    return new Promise((resolve, reject)=>{
      this.http.get("http://localhost:8080/user", {}, {}).then(response=>{
        try{
          console.log(response)

          let users:User[]=JSON.parse(response.data)
          while(find==false){

          }
          for (let i = 0; i < users.length; i++) {
            if(users[i]==){

            }
            
          }
          resolve(users)
        }catch(err){
          reject(err)
        }
      })
    })
  }


  public updateUser():Promise<User[]>{
    return new Promise((resolve, reject)=>{
      this.http.get("http://localhost:8080/user", {}, {}).then(response=>{
        try{
          console.log(response)

          let users:User[]=JSON.parse(response.data)
          
          resolve(users)
        }catch(err){
          reject(err)
        }
      })
    })
  }

}
