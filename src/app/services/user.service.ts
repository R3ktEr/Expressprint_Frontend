import {Injectable} from '@angular/core';
import {_User} from '../model/User';
import {HttpClient} from '@angular/common/http';

import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) { }

  public createUpdateUser(user: _User): Observable<_User> {
    return this.http.post<_User>(`${environment.serverUrl}user`,user);
  }


  public getUsers():Observable<_User[]>{
    let users=this.http.get<_User[]>(`${environment.serverUrl}user`);

    return users;
  }

  public getUserByMail(mail:string):Observable<_User>{
    let u=this.http.get<_User>(`${environment.serverUrl}user/${mail}`);

    return u;
  }

  public deleteUser(id:number):Observable<string>{
    let response=this.http.post<string>(`${environment.serverUrl}user`,id);

    return response;
  }
}

