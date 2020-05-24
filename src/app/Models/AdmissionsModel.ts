export class AdmissionsModel{
    studentId:string;
    firstName:string;
    lastName:string;
    greVerbalScore:number;
    greQuantScore:number;
    greTotalScore:number;
    greEssayScore:number;
    gpa:number;
    intendedProgram:string;
    date:string;
    intendedValidators=[];
    downloadApplications=[];
    accepts=[];
    rejects=[];
    comments=[];
    rejectionReasonsFromModel={};
    daysForEmailAlert:string;
    constructor(){
       

    }
}