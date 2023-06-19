import { Component, OnInit } from '@angular/core';
import { FileServiceService } from '../file-service.service';
import { ApicallService } from '../apicall.service';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';


export interface ObjectChanged {
  name: string;
  value: string;
}

@Component({
  selector: 'app-sample-form',
  templateUrl: './sample-form.component.html',
  styleUrls: ['./sample-form.component.scss']
})
export class SampleFormComponent implements OnInit {

  constructor(
    private fileService: FileServiceService,
    private api: ApicallService,
    private http : HttpClient
  ) { }

  // ActionList: ObjectChanged[] = [];
  ActionList : any = {
    name: "",
    sex: "",
    country: "",
    message:"",
    newsletter:""
  };

  addAction(name: string, value: string) {
    const newAction: ObjectChanged = { name : name, value : value };
    // this.ActionList.push(newAction);
  }

  ngOnInit(): void {
    // this.createFile()
    this.doThings()
  }

  createFile(content:string) {
    // const content = 'Hello, world!';
    const fileName = 'example.txt';

    this.fileService.createAndDownloadFile(content, fileName);
  }


  ActionDoneID = 0;


  getActions(){

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = "";

    let requestOptions : any = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/api/latestaction", requestOptions)
      .then(response => response.text())
      .then(result => {
        // alert(result)
        this.doActions(result)
      })
      .catch(error => console.log('error', error));
  }

  lastActionDone : number = 0;

  doActions(response : any){
    let currentAction = JSON.parse(response);
    console.log("currentAction : ", currentAction);
    
    if(currentAction[0].ID > this.lastActionDone){
      let ngmodelname = currentAction[0].name;
      let ngmodeltype = currentAction[0].controlType;
      let ngmodelvalue = currentAction[0].value;
      let ngmodelID = currentAction[0].controlID;

      console.log("Name : ", ngmodelname);
      console.log("Type : ", ngmodeltype)
      console.log("Value : ", ngmodelvalue);
      console.log("ID : ", ngmodelID);
      

      switch(ngmodeltype){
        case "radio":
          let radiobutton = <HTMLInputElement>document.getElementById(ngmodelID);
          radiobutton.checked = true;
          this.lastActionDone = currentAction[0].ID
          break;
        case "checkbox":
          let checkbox = <HTMLInputElement>document.getElementById(ngmodelID);
          checkbox.checked = true;
          this.lastActionDone = currentAction[0].ID
          break;
        case "select-one":
          let dropdown = <HTMLInputElement>document.getElementById(ngmodelID);
          dropdown.value = ngmodelvalue;
          break;
        case "text":
          var input = <HTMLInputElement>document.getElementById(ngmodelID);
          input.value = ngmodelvalue;
          break;
        case "submit":
          var button = <HTMLButtonElement>document.getElementById(ngmodelID);
          alert("button clicked");
          button.click();
          break;
        default:
          console.log("invalid type");
          
          break;
      }

      if(ngmodeltype == 'radio'){
        
      }

      // let  input = document.getElementsByName(ngmodelname)<HTMLInputElement>;
      var input = <HTMLInputElement>document.getElementsByName(ngmodelname)[0];

      // input.nodeValue = ngmodelvalue
      input.value = ngmodelvalue
      // input.innerHTML = ngmodelvalue
      
      // this.lastActionDone = currentAction[0].ID

    }
    
  }

  async onInputChange(event : any){



    let role = this.checkRole();
    console.log("Role : ", role);
    

    if(role == 'customer'){
      return
    }

    console.log(event);
    let name : string = event.srcElement.name;
    let value : string = event.target.value;
    let controlType : string = event.srcElement.type;
    let controlID : string = event.srcElement.id;


    this.api.postActions(name,controlType,controlID,value)?.subscribe(
      (response) => {
        console.log("Response : ", response);
        // alert(response)      
  
      },
      (error) => {
        console.log('Error : ',error);
        
      }
    )
    
  }

  createJSONString(ActionList : ObjectChanged){
    let jstring = "[{\"name\":\"name\",\"value\":\"Atul\"}]"    

  }

  printActionList(){
    console.log(this.ActionList);
    let content = JSON.stringify(this.ActionList)
    // let content = `{\"name\":\"${this.ActionList.name}\",\"sex\":\"${this.ActionList.sex}\",\"country\":\"${this.ActionList.country}\",\"message\":\"${this.ActionList.message}\",\"newsletter\":\"${this.ActionList.newsletter}\"}`
    this.createFile(content)
    
  }


  // ActionDoneID = 0;
  isAgent = true;
  isCustomer = true;
  role = ""

  setRole(){
    if(this.role == "customer"){
      this.isCustomer = true
      this.isAgent = false
      alert("Role set to customer")
    }
    
    if(this.role == "agent"){
      this.isAgent = true
      this.isCustomer = false
      alert("Role set to agent")
    }
  }

  checkRole(){
    if(this.isCustomer)
     return "customer"
    else if(this.isAgent)
      return "agent"
    else
      return "NO_ROLES"
  }

  stopCalling() {
    this.numberSubscription?.unsubscribe();
  }
  intervalTime = 1000;

  numberSubscription: Subscription | undefined;
  async doThings(){
    let role = this.checkRole()

    if(role == "customer"){
      this.numberSubscription = interval(this.intervalTime).subscribe(() => {
        
        this.getActions()
      });
    }

    if(role == "agent"){
      this.stopCalling()
    }

  }

  startApiCalls() {
    this.apiCallSubscription = interval(this.intervalTime).subscribe(() => {
      this.api.getActions().subscribe(
        response => {
          // Process the API response as needed
          console.log(response);
          this.doActions(response)
        },
        error => {
          // Handle API call errors if necessary
          console.error(error);
        }
      );
    });
  }

  stopApiCalls() {
    if (this.apiCallSubscription) {
      this.apiCallSubscription.unsubscribe();
    }
  }

  apiCallSubscription : any




}
