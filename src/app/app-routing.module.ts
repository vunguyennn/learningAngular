import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteGuardService } from '@pendo/services';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { WelcomeComponent } from './welcome/character.component';
import { AppComponent } from './app.component';
import { PreventLoggedInAccessGuard } from 'src/services/prevent-logged-in-access.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [RouteGuardService] },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [PreventLoggedInAccessGuard],
  },

  // { path: 'logout', component: LogoutComponent },
  {
    path: 'character',
    component: WelcomeComponent,
    canActivate: [RouteGuardService],
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  { path: 'home', redirectTo: '' },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
