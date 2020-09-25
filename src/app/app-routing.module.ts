import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: 'groups',
    loadChildren: () => import('./core/groups/group.module').then(m => m.GroupModule)
  },
  {
    path: 'students',
    loadChildren: () => import('./core/students/students.module').then(m => m.StudentsModule)
  },
  {
    path: 'training',
    loadChildren: () => import('./core/training/training.module').then(m => m.TrainingModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
