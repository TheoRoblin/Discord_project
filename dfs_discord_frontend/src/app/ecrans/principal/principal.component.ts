import {HttpClient} from '@angular/common/http';
import {Component, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {Serveur} from '../../models/serveur.type';
import {MatTooltipModule} from '@angular/material/tooltip';
import {Salon} from "../../models/salon.type";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {jwtInterceptor} from "../../interceptors/jwt.interceptor";
import {jwtDecode} from "jwt-decode";
import {Message} from "../../models/message.type";
import {MatDialog} from "@angular/material/dialog";
import {ModalComponent} from "../../components/modal/modal.component";
import {DatePipe} from "@angular/common";
import {Observable, switchMap} from "rxjs";
import {User} from "../../models/user.type";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {list} from "postcss";


@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [MatIconModule, RouterLink, MatTooltipModule, MatInput, ReactiveFormsModule, MatButton, DatePipe, MatMenuTrigger, MatMenu],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.scss',
})
export class PrincipalComponent {
  constructor(public dialog: MatDialog) {
  }

  http: HttpClient = inject(HttpClient);
  listeServeur: Serveur[] = [];
  listeSalon: Salon[] = []
  listeMessage: Message[] = [];
  listeUser: User[]=[];
  selectedServeur: Serveur | null = null;
  selectedSalon: Salon | null = null
  snackBar: MatSnackBar = inject(MatSnackBar);


  formBuilder: FormBuilder = inject(FormBuilder);

  formulaire: FormGroup = this.formBuilder.group({
    nom: ['', [Validators.required]],
  });


  formulaireMessage: FormGroup = this.formBuilder.group({
    contenu: ['', [Validators.required]]
  })

  ngOnInit() {
    const jwt = localStorage.getItem('jwt');


    if (jwt) {
      this.http
        .get<Serveur[]>('http://localhost:3000/serveur/possede')
        .subscribe((listeServeur) => console.log(this.listeServeur = listeServeur));
    }
  }

  onServeur(serveur: Serveur) {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      this.selectedServeur = serveur

      this.http.get<Salon[]>(`http://localhost:3000/salon/${serveur._id}`).subscribe((listeSalon) => (this.listeSalon = listeSalon))
      this.http.get<User[]>(`http://localhost:3000/user/${serveur._id}`).subscribe((listeUser) => console.log(this.listeUser = listeUser))
    }

  }

  onSalon(salon: Salon) {
    this.selectedSalon = salon

    console.log("je suis dans le salon" + salon.nom)
    this.http.get<Message[]>(`http://localhost:3000/message/${this.selectedSalon?._id}`).subscribe((listeMessage) => console.log(this.listeMessage = listeMessage))

  }

  CreateMessage() {
    const messageData = {
      ...this.formulaireMessage.value,
      salonId: this.selectedSalon?._id
    };

    this.http.post('http://localhost:3000/message', messageData)
      .pipe(
        switchMap(() => this.getMessagesForSalon(this.selectedSalon?._id))
      )
      .subscribe(listeMessage => {
        this.listeMessage = listeMessage;
        console.log(this.listeMessage);
      });
  }

  getMessagesForSalon(salonId: string | undefined): Observable<Message[]> {
    return this.http.get<Message[]>(`http://localhost:3000/message/${salonId}`);
  }

  openDialog() {
    this.dialog.open(ModalComponent).afterClosed().subscribe(data =>{
      const salonData = {
        nom: data.nom,
        serveurId: this.selectedServeur?._id
      }
      this.http.post('http://localhost:3000/salon', salonData).subscribe((listeSalon) => (this.snackBar.open(
        'Vous avez crée un salon',
        undefined,
        {
          duration: 3000,
        })))
      this.http.get<Salon[]>(`http://localhost:3000/salon/${this.selectedServeur?._id}`).subscribe((listeSalon) => (this.listeSalon = listeSalon))
    })
  }

  userBlock( userId: string, serveurId?: string){
    console.log(userId)
    this.http.put(`http://localhost:3000/serveur/block/${serveurId}`, {userId}).subscribe((listUser) => (console.log(this.listeServeur)))
  }

  userUnblock(userId: string, serveurId?: string){
    this.http.put(`http://localhost:3000/serveur/unblock/${serveurId}`, userId).subscribe((listUser) => (console.log(this.listeServeur)))
  }

}
