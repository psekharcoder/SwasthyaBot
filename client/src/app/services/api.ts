import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private api = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  login(data: any) {
    return this.http.post(`${this.api}/auth/login`, data);
  }

  signup(data: any) {

    return this.http.post(

      `${this.api}/auth/signup`,

      data

    );

  }

  verifyOTP(data: any) {

    return this.http.post(

      `${this.api}/auth/verify-otp`,

      data

    );

  }

  chat(message: string, conversationId: string, token: string) {

    return this.http.post(

      `${this.api}/chat`,

      {

        message,
        conversationId

      },

      {

        headers: {

          Authorization: `Bearer ${token}`

        }

      }

    );

  }
  getHistory(token: string) {

    return this.http.get(

      `${this.api}/chat/history`,

      {

        headers: {

          Authorization: `Bearer ${token}`

        }

      }

    );

  }

  getConversations(token: string) {

    return this.http.get(

      `${this.api}/conversation`,

      {

        headers: {

          Authorization: `Bearer ${token}`

        }

      }

    );

  }

  getConversation(id: string, token: string) {

    return this.http.get(

      `${this.api}/conversation/${id}`,

      {

        headers: {

          Authorization: `Bearer ${token}`

        }

      }

    );

  }

  getProfile(token: string) {

    return this.http.get(

      `${this.api}/auth/profile`,

      {

        headers: {

          Authorization: `Bearer ${token}`

        }

      }

    );

  }


}