import {Component, inject, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    MatDialogContent,
    FormsModule,
    MatButton,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatFormField
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<ModalComponent>)

  formulaire: FormGroup = this.formBuilder.group({
    nom: ['', [Validators.required]],
  });

  onSend(){
    this.dialogRef.close(
      {nom: this.formulaire.get("nom")?.value}
    )
  }

}
