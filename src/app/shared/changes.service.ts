import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})

export class ChangesService {
  constructor(private http: HttpClient) {
  }

  getChanges(): Observable<any>  {
    return this.http.get<any>('https://api.endotech.io/api/v1/majors/');
}
}
