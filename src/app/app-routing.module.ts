import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteGuardService } from '@pendo/services';
import { CharacterDetailsComponent } from './character-details/character-details.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/character.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [RouteGuardService],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'character',
    component: WelcomeComponent,
    canActivate: [RouteGuardService],
  },
  {
    path: 'register',
    component: RegisterComponent,
  },

  {
    path: 'character/:name',
    component: CharacterDetailsComponent,
    canActivate: [RouteGuardService],
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
