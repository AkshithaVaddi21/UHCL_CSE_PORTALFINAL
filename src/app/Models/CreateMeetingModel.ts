export class CreateMeetingModel{
    subject:string;
    date: string;
    formateddate:string;
    facilitatedBy:string;
    agendaList:string;
    department:string;
    HH:string;
    MM:string;
    noon:string;
    time:string;
    duration:String;
    departmentList:string[] = [];
    meetingMinutes:string;
    documentIdOfAgendaListCollection:string;
    inlineCheckbox1:boolean;
    inlineCheckbox2:boolean;
    inlineCheckbox3:boolean;
    inlineCheckbox4:boolean;
    inlineCheckbox5:boolean;
    approvals:any[];
    rejects:any[];
    comments:any=[];
    documentIdOfCurrentMeeting:string;
    finalised:boolean;
    files:string[];
    operation:string;
    attendees:string[]=[];
    saveMeetingMinutesAndSendEmail:boolean;
  //downloadFiles:any;
  downloadFiles: any[] = [
    {
      uniqueNameForReference: "",
      linkToView: "",
      typeOfFile:""
    }
  ];
  daysForEmailAlert:string;
    constructor(){
       

    }

}