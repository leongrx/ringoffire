import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit{
  game: Game;
  gameId: string;
  gameOver = false;

  constructor(private firestore: AngularFirestore, public dialog: MatDialog, private route: ActivatedRoute) {}

   ngOnInit(): void{
    this.newGame();
    this.route.params.subscribe(async (params) => {
      this.gameId = params.id;
      this
        .firestore
        .collection('Games')
        .doc(this.gameId)
        .valueChanges()
        .subscribe((currentGame: any) => {
          this.game.currentPlayer = currentGame.currentPlayer,
          this.game.playedCards = currentGame.playedCards,
          this.game.players = currentGame.players,
          this.game.player_images = currentGame.player_images,
          this.game.stack = currentGame.stack,
          this.game.pickCardAnimation = currentGame.pickCardAnimation,
          this.game.currentCard = currentGame.currentCard
        })
    })
  }

  newGame() {
    this.game = new Game();
  }
  
  takeCard() {
    if(this.game.stack.length == 0) {
      this.gameOver = true;
    } else if(!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
        }, 1000)
      } 
    }

  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      if(change) {
        if(change == 'DELETE') {
          this.game.players.splice(playerId, 1);
        }
        this.game.player_images[playerId] = change;
      }
      this.saveGame();
    });

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('male-profile.png');
        this.saveGame();
      }
    });
  }

  saveGame() {
    this
     .firestore
     .collection('Games')
     .doc(this.gameId)
     .set(this.game.toJson());
  }
}

