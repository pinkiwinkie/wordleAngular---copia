import { Component, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-change-word',
  templateUrl: './changeWord.component.html',
  styleUrls: ['./changeWord.component.css']
})
export class ChangeWordComponent{
  @Output() addWordEvent = new EventEmitter<string>();
  newWordForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.newWordForm = this.formBuilder.group({
      newWord: ['', [Validators.required]]
    });
  }

  addWord(): void {
    const newWordControl = this.newWordForm.get('newWord');
    if (newWordControl && newWordControl.valid) {
      const newWord = newWordControl.value as string;  
      console.log('Emitting event with new word:', newWord);
      this.addWordEvent.emit(newWord);
      this.newWordForm.reset(); 
    }
  }  
}