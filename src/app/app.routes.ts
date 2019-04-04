import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found/not-found.component';
import { SigninComponent } from './pages/signin/signin/signin.component';
import { SignupComponent } from './pages/signup/signup/signup.component';

export const appRoutes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'signin',
        component: SigninComponent,
    },
    {
        path: 'signup',
        component: SignupComponent,
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
