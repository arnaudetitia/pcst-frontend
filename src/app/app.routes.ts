import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { homepageGuard } from './guards/homepage.guard';
import { LoginAdminComponent } from './components/login-admin/login-admin.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent, canActivate: [homepageGuard] },
  { path: 'login', component: LoginAdminComponent },
];
