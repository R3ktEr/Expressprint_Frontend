import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {PricesRequest} from '../model/Products';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  constructor(private readonly http: HttpClient) {
  }

  public getAllPrices(): Observable<PricesRequest> {
    return this.http.get<PricesRequest>(`${environment.serverUrl}prices`);
  }

  public changeAllPrices(newPrices: PricesRequest): Observable<PricesRequest> {
    return this.http.put<PricesRequest>(`${environment.serverUrl}prices`, newPrices);
  }

  public getAllHistoricalPrices(offset: number): Observable<PricesRequest> {
    return this.http.get<PricesRequest>(`${environment.serverUrl}prices/history/${offset}`);
  }

}
