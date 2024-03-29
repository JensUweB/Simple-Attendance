import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'groups',
    loadChildren: () => import('./core/groups/group.module').then((m) => m.GroupModule),
  },
  {
    path: 'students',
    loadChildren: () => import('./core/students/students.module').then((m) => m.StudentsModule),
  },
  {
    path: 'attendance',
    loadChildren: () => import('./core/attendance/attendance.module').then((m) => m.AttendanceModule),
  },
  {
    path: 'backup',
    loadChildren: () => import('./backup/backup.module').then((m) => m.BackupPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
