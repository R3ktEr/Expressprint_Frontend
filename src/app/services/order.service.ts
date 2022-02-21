import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Order } from '../model/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HTTP) { }

  public async getAllOrders():Promise<Order[]> {
    return new Promise((resolve, reject)=>{
      this.http.get("http://localhost:8080/orders", {}, {}).then(response=>{
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
}
