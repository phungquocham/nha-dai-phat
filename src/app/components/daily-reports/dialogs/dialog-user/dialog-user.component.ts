import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UsersService } from 'src/app/shared/services/api/users.service';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.css']
})
export class DialogUserComponent implements OnInit {

  usersSelected = 0;
  usersList = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogUserComponent>,
    private usersService: UsersService  ) {
  }

  ngOnInit() {
    this.usersService.getUserName().subscribe(res => {
      this.usersList = res;
    });
  }

  onSubmit = () => {
    this.closeDialog({userId: this.usersSelected});
  }

  closeDialog(data = null) {
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
    this.dialogRef.close(data);
  }
}
