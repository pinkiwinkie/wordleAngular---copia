import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  showGame = false;
  showWord = false;
  currentWord: string = '';

  goToGame(): void {
    this.showGame = true;
    this.showWord = false;
  }

  showChangeWordForm(): void {
    this.showWord = true;
    this.showGame = false;
  }

  handleAddWordEvent(newWord: string): void {
    this.currentWord = newWord;
    console.log(this.currentWord);
    this.showGame = true;
    this.showWord = false;
  }
}
