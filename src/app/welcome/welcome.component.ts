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
    this.showWord = false;  }

  addWord(newWord: string): void{
    this.showWord = true;  
    this.currentWord = newWord;
    setTimeout(() => {
      this.showGame = true;   
    }, 0);
  }
}
