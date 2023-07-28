import { Adresse } from './adresse.model';
export class Administrateur {
    public nom: string;
    public prenom: string;
    public email: string;
    public password: string;
    public role: string;
    public datedebut: Date;
    public active: boolean;
    public tel: number;
    public adresse: Adresse;

    constructor(nom:string,prenom:string,email:string,password:string
        ,role:string,datedebut: Date,active:boolean,tel:number,adresse:Adresse){
            this.nom=nom;
            this.prenom=prenom;
            this.email=email;
            this.password=password;
            this.role=role;
            this.datedebut=datedebut;
            this.active=active;
            this.tel=tel;
            this.adresse=adresse;
        }
}
export class AdminInfo {
    public id: number;
    public nom: string;
    public prenom: string;
    public email:string;
    public active: boolean;
}

export class adminlogin {
    email: string;
    password: string;


    constructor(email: string,password: string){
        this.email=email;
        this.password=password;
    }
}