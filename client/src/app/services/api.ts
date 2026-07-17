import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private api = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.api}/auth/login`, data);
  }
}