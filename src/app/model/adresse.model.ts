export class Adresse {
    public ville: string;
    public codePostale: string;
    public numRue: String;

    constructor(ville:string, codep:string, numrue:string){
     this.ville=ville;
     this.codePostale=codep;
     this.numRue=numrue;
    }
}