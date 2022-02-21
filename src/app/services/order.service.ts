import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { environment } from 'src/environments/environment';
import { Order } from '../model/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HTTP) { }

  public async getAllOrders():Promise<Order[]> {
    return new Promise((resolve, reject)=>{
      this.http.get(environment.serverUrl+"orders", {}, {}).then(response=>{
        try{
          console.log(response)

          let orders:Order[]=JSON.parse(response.data)
          
          resolve(orders)
        }catch(err){
          reject(err)
        }
      })
    })
  }

  public async getOrderById(id_user:number, id_order:number):Promise<Order> {
    return new Promise((resolve, reject)=>{
      this.http.get(environment.serverUrl+"orders/"+id_user+"/"+id_order, {}, {}).then(response=>{
        try{
          console.log(response)

          let order:Order=JSON.parse(response.data)
          
          resolve(order)
        }catch(err){
          reject(err)
        }
      })
    })
  }

  public async getOrdersByUser(id_user:number):Promise<Order[]> {
    return new Promise((resolve, reject)=>{
      this.http.get(environment.serverUrl+"orders/"+id_user, {}, {}).then(response=>{
        try{
          console.log(response)

          let orders:Order[]=JSON.parse(response.data)
          
          resolve(orders)
        }catch(err){
          reject(err)
        }
      })
    })
  }

  public async saveOrder(order:Order):Promise<Order> {
    return new Promise((resolve, reject)=>{
      try{
        let orderJSON:any=JSON.stringify(order)

        this.http.post(environment.serverUrl+"orders", orderJSON, {}).then(response=>{
          try{
            console.log(response)
  
            let order:Order=JSON.parse(response.data)
            
            resolve(order)
          }catch(err){
            reject(err)
          }
        })
      }catch(err){
        reject(err)
      }
    })
  }

  public async updateOrder(order:Order):Promise<Order> {
    return new Promise((resolve, reject)=>{
      try{
        let orderJSON:any=JSON.stringify(order)

        this.http.put(environment.serverUrl+"orders", orderJSON, {}).then(response=>{
          try{
            console.log(response)
  
            let order:Order=JSON.parse(response.data)
            
            resolve(order)
          }catch(err){
            reject(err)
          }
        })
      }catch(err){
        reject(err)
      }
    })
  }

  public async deleteOrderById(id_user:number, id_order:number):Promise<string> {
    return new Promise((resolve, reject)=>{
      this.http.delete(environment.serverUrl+"orders/"+id_user+"/"+id_order, {}, {}).then(response=>{
        try{
          console.log("Pedido borrado")

          let orders:Order[]=JSON.parse(response.data)
          
          resolve("Pedido borrado")
        }catch(err){
          reject(err)
        }
      })
    })
  }
}
