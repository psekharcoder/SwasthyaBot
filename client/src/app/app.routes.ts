import { Routes } from '@angular/router';


import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Otp } from './pages/otp/otp';
import { Chatbot } from './pages/chatbot/chatbot';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'otp',
    component: Otp
  },

  {
    path: 'chat',
    component: Chatbot
  },

  {
    path: 'profile',
    component: Profile
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];