import { Injectable } from '@angular/core';
import {User} from '../model/User';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http:HTTP) { }


  public async addUser(user:User):Promise<User>{
    return new Promise((resolve, reject)=>{
      try{
        let userJSON:any=JSON.stringify(user)

        this.http.post(environment.serverUrl+"users", userJSON, {}).then(response=>{
          try{
            console.log(response)
  
            let user:User=JSON.parse(response.data)
            
            resolve(user)
          }catch(err){
            reject(err)
          }
        })
      }catch(err){
        reject(err)
      }
    })
  }

  

  public async getUsers():Promise<User[]>{
    
    return new Promise((resolve, reject)=>{
      this.http.get(environment.serverUrl+"user", {}, {}).then(response=>{
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

  public async getUserByMail(userMail:string):Promise<User>{
    return new Promise((resolve, reject)=>{
      this.http.get(environment.serverUrl+"user/"+userMail,{},{}).then(response=>{
        try {
          console.log(response)

          let user:User=JSON.parse(response.data)
          resolve(user);
        } catch (err) {
          reject(err)
        }
      })
    }) 
  }

  public async deleteUser(id:number):Promise<string>{
    return new Promise((resolve, reject)=>{
      this.http.delete(environment.serverUrl+"user/"+id, {}, {}).then(response=>{
        try{
          console.log("Usuario borrado")

         
          
          resolve("Usuario borrado")
        }catch(err){
          reject(err)
        }
      })
    })
  }
  public async updateUser(user:User):Promise<User>
  {
    return new Promise((resolve, reject)=>{
      try{
        let orderJSON:any=JSON.stringify(user)

        this.http.put(environment.serverUrl+"users", orderJSON, {}).then(response=>{
          try{
            console.log(response)
  
            let user:User=JSON.parse(response.data)
            
            resolve(user)
          }catch(err){
            reject(err)
          }
        })
      }catch(err){
        reject(err)
      }
    })
  }



}

