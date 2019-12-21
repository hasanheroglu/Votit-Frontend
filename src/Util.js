export const hostURL = "http://localhost:8080";
export const headers = { 
    'Authorization': localStorage.getItem("Authorization"),
    'Accept':'application/json',
    'Content-Type':'application/json',
    'Access-Control-Allow-Credentials':  true,
    'Access-Control-Allow-Origin':'http://localhost:3000/'
}

export let isSystemAdmin = false;
export let isCompanyAdmin = false;
export let isPollOwner = false;
export let isUser = false;

export function setRoles(){
    let roles = localStorage.getItem("Roles");
    if(roles){
        if(roles.includes("ROLE_SYSTEM_ADMIN")){
          isSystemAdmin = true;
        } else{
          isSystemAdmin = false;
        }
        if(roles.includes("ROLE_COMPANY_ADMIN")){
          isCompanyAdmin = true;
        } else{
          isCompanyAdmin = false;
        }
        if(roles.includes("ROLE_POLL_OWNER")){
          isPollOwner = true;
        } else{
          isPollOwner = false;
        }
        if(roles.includes("ROLE_USER")){
          isUser = true;
        } else{
          isUser = false;
        }
      }
}



