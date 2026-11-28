import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { homepageGuard } from './guards/homepage.guard';
import { LoginAdminComponent } from './components/login-admin/login-admin.component';
import { GestionQuestionsComponent } from './components/admin/gestion-questions/gestion-questions.component';
import { GestionPartieComponent } from './components/admin/gestion-parties/gestion-partie.component';
import { PartieComponent } from './components/partie/partie.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent, canActivate: [homepageGuard] },
  { path: 'login', component: LoginAdminComponent },
  { path: 'partie', component: PartieComponent },
  {
    path: 'admin',
    children: [
      { path: 'gestion-questions', component: GestionQuestionsComponent },
      { path: 'gestion-parties', component: GestionPartieComponent },
    ],
  },
];
