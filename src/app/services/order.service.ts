import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../model/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) { }

  public getAllOrders():Observable<Order[]> {
    let orders=this.http.get<Order[]>(`${environment.serverUrl}orders`)

    return orders;
  }

  public getOrderById(id_user:number, id_order:number):Observable<Order> {
    let order=this.http.get<Order>(`${environment.serverUrl}orders/${id_user}/${id_order}`)

    return order;
  }

  public getOrdersByUser(id_user:number): Observable<Order[]> {
    let order=this.http.get<Order[]>(`${environment.serverUrl}orders/${id_user}`)

    return order;
  }

  public createOrder(order:Order):Observable<Order> {
    let o=this.http.post<Order>(`${environment.serverUrl}orders`, order)

    return o;
  }

  public updateOrder(order:Order):Observable<Order> {
    let o=this.http.put<Order>(`${environment.serverUrl}orders`,order)

    return o;
  }

  public deleteOrderById(id_user:number, id_order:number):Observable<string> {
    let isDeleted=this.http.delete<string>(`${environment.serverUrl}orders/${id_user}/${id_order}`)

    return isDeleted;
  }
}
