import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent {

  allProfilePictures = ['female-profile.png', 'male-profile.png', 'pinguin.svg', 'monkey.png', 'winkboy.svg', 'serious-woman.svg']

  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>) {}


}
