import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Order} from '../model/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) { }

  public getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.serverUrl}orders`);
  }

  public getOrderById(idUser: number, idOrder: number): Observable<Order> {
    return this.http.get<Order>(`${environment.serverUrl}orders/${idUser}/${idOrder}`);
  }

  public getOrdersByUser(idUser: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.serverUrl}orders/${idUser}`);
  }

  public createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${environment.serverUrl}orders`, order);
  }

  public uploadDocument(formData: FormData, user: string, mail: string): Observable<Map<string, string[]>> {
    formData.append('user', user);
    formData.append('mail', mail);
    return this.http.post<Map<string, string[]>>(`${environment.serverUrl}orders/upload`, formData);
  }

  public updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(`${environment.serverUrl}orders`,order);
  }

  public deleteOrderById(idUser: number, idOrder: number): Observable<string> {
    return this.http.delete<string>(`${environment.serverUrl}orders/${idUser}/${idOrder}`);
  }
}
