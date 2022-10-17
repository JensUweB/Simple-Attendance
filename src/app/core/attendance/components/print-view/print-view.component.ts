import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Training } from 'src/app/core/classes/training.class';

@Component({
  selector: 'app-print-view',
  templateUrl: './print-view.component.html',
  styleUrls: ['./print-view.component.scss'],
})
export class PrintViewComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() trainings: Training[];
  @ViewChild('#printArea') printArea;

  constructor() {}

  ngOnInit() {
    document.body.setAttribute('color-theme', 'light');
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    document.body.setAttribute('color-theme', localStorage.getItem('theme'));
  }

  countStatus(training: Training, status: number) {
    let count = 0;
    training.students.forEach((student) => {
      if (student.status === status) {
        count++;
      }
    });
    return count;
  }

  flattenData() {
    // Flatten the data to fit into a table
    const flatData = [];
    this.trainings.forEach((training) => {
      training.students.forEach((item) => {
        flatData.push({
          ID: training.id,
          GroupName: training.group.name,
          Date: training.datetime,
          StudentId: item.student.id,
          StudentName: item.student.name,
          StudentStatus: item.status,
        });
      });
    });
    return flatData;
  }
}
