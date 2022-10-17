import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { take } from "rxjs/operators";
import { State } from "../store";
import { GroupsActions, StudentsActions } from "../store/actions";
import { GroupsSelector } from "../store/selectors";
import { Capacitor } from "@capacitor/core";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";

@Component({
  selector: "app-backup",
  templateUrl: "./backup.page.html",
  styleUrls: ["./backup.page.scss"],
})
export class BackupPage implements OnInit {
  constructor(private store: Store<State>) {}

  ngOnInit() {}

  exportGroups(): void {
    this.store
      .select(GroupsSelector.groups)
      .pipe(take(1))
      .subscribe((groups) => {
        this.saveObjectAsFile(groups, "groups.json");
      });
  }

  importGroups(event): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        const groups = JSON.parse(reader.result);
        this.store.dispatch(GroupsActions.addGroups({ groups }));
        let students = [];
        groups.forEach((g) => students.push(...g.students));
        this.store.dispatch(StudentsActions.addStudents({ students }));
      }
    };
    reader.readAsText(event.files[0]);
  }

  async saveObjectAsFile(obj: any, filename: string) {
    const json = JSON.stringify(obj);
    switch (Capacitor.getPlatform()) {
      case "web": {
        const blob = new Blob([json], { type: "text/json" });
        const element = document.createElement("a");
        element.href = window.URL.createObjectURL(blob);
        element.download = filename;
        element.click();
        break;
      }
      case "android":
      case "ios":
        await Filesystem.writeFile({
          path: "Download/" + filename,
          data: json,
          directory: Directory.ExternalStorage,
          encoding: Encoding.UTF8,
        });
        break;
    }
  }
}
