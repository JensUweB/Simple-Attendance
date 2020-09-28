import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Training} from '../../services/training.service';
import {ExportToCsv} from 'export-to-csv';

@Component({
  selector: 'app-print-view',
  templateUrl: './print-view.component.html',
  styleUrls: ['./print-view.component.scss'],
})
export class PrintViewComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() trainings: Training[];
  @ViewChild('#printArea') printArea;

  constructor() { }

  ngOnInit() {
    document.body.setAttribute('color-theme', 'light');
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    document.body.setAttribute('color-theme', localStorage.getItem('theme'));
  }

  countStatus(training: Training, status: number) {
    let count = 0;
    training.students.forEach((student) => {
      if (student.status === status) { count ++; }
    });
    return count;
  }

  csvExport() {
    // Flatten the data to fit into a table
    const flatData = [];
    this.trainings.forEach((training) => {
      training.students.forEach((item) => {
        flatData.push(
            {
              ID: training.id,
              GroupName: training.group.name,
              Date: training.datetime,
              StudentId: item.student.id,
              StudentName: item.student.name,
              StudentStatus: item.status
            }
        );
      });
    });
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'My Awesome CSV',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(flatData);
  }
}
