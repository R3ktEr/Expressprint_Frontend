import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public async setItem(key:string, value:any):Promise<boolean>{
    let result:boolean = false;

    try{
      await Storage.set({
        key:key,
        value:JSON.stringify(value)
      })
      result=true;
    }catch(err){
      //console.log(err)
    }

    return Promise.resolve(result);
  }

  public async getItem(key:string):Promise<any>{
    let data=null;

    try{
      data=await Storage.get({key:key});
      data=data.value;
      if(data!=null){
        data=JSON.parse(data);
      }
    }catch(err){
      //console.log(err)
    }

    return Promise.resolve(data);
  }

  public async removeItem(key:string):Promise<boolean>{
    let result=false;

    try{
      await Storage.remove({key:key});
      result=true;
    }catch(err){
      //console.log(err);
    }

    return result;
  }
}
