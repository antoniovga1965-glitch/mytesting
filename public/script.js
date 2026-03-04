// regitsrationform
const regform = document.getElementById('regform');
const loginform = document.getElementById('loginform');
const registrationnames= document.getElementById('registrationnames');
const registrationemail =document.getElementById('registrationemail');
const registrationphonenumber = document.getElementById('registrationphonenumber');
const registrationpassword  =document.getElementById('registrationpassword');
const confirmpassword = document.getElementById('confirmpassword');
const submitbtn  =document.getElementById('submitbtn');
const registrationresults  =document.getElementById('registrationresults');
const landingpage = document.getElementById('landingPage');



const mainApp = document.getElementById('mainApp');

regform.addEventListener('submit',(e)=>{
e.preventDefault()
})
loginform.addEventListener('submit',(e)=>{
e.preventDefault()
})

submitbtn.addEventListener('click',()=>{
    const NAMES = registrationnames.value.trim();
    const EMAIL = registrationemail.value.trim();
    const PHONE = registrationphonenumber.value.trim();
    const PASSWORD = registrationpassword.value.trim();
    const CONFIRMPASSWORD = confirmpassword.value.trim();

    if(PASSWORD!==CONFIRMPASSWORD){
        registrationresults.textContent='Password do not match try again';
        registrationresults.classList.remove('hidden');

        setTimeout(() => {
          registrationresults.classList.add('hidden');  
        }, 3000);
        return ;

    }
    fetch('/registrar/registration',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({NAMES,EMAIL,PHONE,PASSWORD})

    })
    .then(res=>{
if(res.status===200){
    mainApp.classList.remove('hidden');
    loginForm1.classList.add('hidden');
    landingpage.classList.add('hidden'); 
}
return res.json()
    
    })
    
    .then(data=>{
        registrationresults.classList.remove('hidden');
        registrationresults.textContent = data.message;


    })
    .catch(err=>{
        console.log(err);
    
        registrationresults.classList.remove('hidden');
        registrationresults.textContent = err.message;

        setTimeout(() => {
           registrationresults.classList.add('hidden');  
        }, 4000);
    })
    registrationnames.value="";
    registrationemail.value="";
    registrationphonenumber.value="";
    registrationpassword.value="";
    confirmpassword.value=""


    

})

// login route

const usernamelogin = document.getElementById('usernamelogin');
const usernameerror = document.getElementById('usernameerror');
const password = document.getElementById('password');
const passworderror = document.getElementById('passworderror');
const loginbtn = document.getElementById('loginbtn');
const results = document.getElementById('results');
const signuplink  =document.getElementById('signuplink')
const tologin = document.getElementById('tologin');
const registerForm = document.getElementById('registerForm');
const loginForm1= document.getElementById('loginForm1');
const showpassword = document.getElementById('showpassword');

const adminDashboard = document.getElementById('adminDashboard');


signuplink.addEventListener("click",()=>{
    registerForm.classList.remove('hidden');
    loginForm1.classList.add('hidden');
})
tologin.addEventListener("click",()=>{
    registerForm.classList.add('hidden');
    loginForm1.classList.remove('hidden');
})


  showpassword.addEventListener('click',()=>{
            if (password.type==='password'){
                 password.type='text';
            }else{
                password.type='password';
            }
         })

loginbtn.addEventListener('click',()=>{
    const USERNAMELOGIN = usernamelogin.value.trim();
    const PASSWORDLOGIN = password.value.trim();

    if(!USERNAMELOGIN||!PASSWORDLOGIN){
        usernameerror.classList.remove('hidden');
        passworderror.classList.remove('hidden');

        setTimeout(() => {
            usernameerror.classList.add('hidden');
        passworderror.classList.add('hidden');
        
        }, 4000);
        return;
    }
    fetch('/loginR/login',{
       method:'POST',
       headers:{'Content-Type':"application/json"},
       credentials:'include',
       body:JSON.stringify({USERNAMELOGIN,PASSWORDLOGIN})
    })
    .then(res=>{
if(res.status===200){
    mainApp.classList.remove('hidden');
    loginForm1.classList.add('hidden');
    landingpage.classList.add('hidden');
    
     }
     return res.json();
    }
        
)
    .then(data=>{

        if(data.role==="admin"){
          adminDashboard.classList.remove('hidden');
            landingpage.classList.add('hidden');
            studentDashboard.classList.add('hidden');
              
        }else if(data.role==='student'){
            adminDashboard.classList.add('hidden');
            landingpage.classList.add('hidden');
            studentDashboard.classList.remove('hidden');
              
        }
        
        results.classList.remove('hidden');
        results.textContent = data.message;

       
    })
    .catch(err=>{
        results.classList.remove('hidden');
        results.textContent = err.message;

        setTimeout(() => {
          results.classList.add('hidden');  
        }, 3000);
    })
    usernamelogin.value="";
    password.value="";
})

const startapplication = document.getElementById('startapplication');
const secondaryForm = document.getElementById('secondaryForm');
const seconday = document.getElementById('seconday');
const universtyapplication = document.getElementById('universtyapplication');
const universityForm = document.getElementById('universityForm');
const univform = document.getElementById('univform');

univform.addEventListener('submit',(e)=>{
e.preventDefault()
})

seconday.addEventListener('submit',(e)=>{
e.preventDefault();
})
startapplication.addEventListener('click',()=>{
   secondaryForm.classList.remove('hidden');
   universityForm.classList.add('hidden')
})

universtyapplication.addEventListener('click',()=>{
universityForm.classList.remove('hidden');
secondaryForm.classList.add('hidden')
})

const darkmode = document.getElementById('darkmode');


darkmode.addEventListener('click',()=>{
document.body.classList.toggle('dark-mode')
})

const hamburgermenu  = document.getElementById('hamburgermenu');
const aside = document.getElementById('aside');

hamburgermenu.addEventListener('click',()=>{
    aside.classList.toggle('left-[0%]')
})

const homebutton = document.getElementById('homebutton');
const dashboard = document.getElementById('dashboard');
const apply = document.getElementById('apply');
const logout = document.getElementById('logout');
const studentDashboard = document.getElementById('studentDashboard');

logout.addEventListener('click',()=>{
    results.innerHTML="";
})

logout.addEventListener('click',()=>{
    fetch('/logoutjs/logout',{
    method:'POST',
    credentials:'include',
    }).then(res=>res.json())
    .then(data=>{
        mainApp.classList.add('hidden');
    landingpage.classList.remove('hidden');
    loginForm1.classList.remove('hidden')
    })
    .catch(err=>{
     console.log(err);
        
    })
})

dashboard.addEventListener('click',()=>{
studentDashboard.scrollIntoView({behavior:'smooth'});

})

apply.addEventListener('click',()=>{
    secondaryForm.scrollIntoView({behavior:'smooth'});
    secondaryForm.classList.remove('hidden');
    adminDashboard.classList.add('hidden')
})

document.addEventListener('click',(e)=>{
    if(!aside.contains(e.target)&& !hamburgermenu.contains(e.target)){
        aside.classList.add('left-[-100%]');
        aside.classList.remove('left-[0%]');

    }
})

const logoutfromadmin  =document.getElementById('logoutfromadmin');

logoutfromadmin.addEventListener('click',()=>{
    fetch('/logoutjs/logoutadmin',{
        method:'POST',
        credentials:'include',
    }).then(res=>res.json())
    .then(data=>{
      adminDashboard.classList.add('hidden');
      studentDashboard.classList.add('hidden');
      landingpage.classList.remove('hidden');
      loginForm1.classList.remove('hidden');
      results.innerHTML="";
    })
    .catch(err=>{
        console.log(err);
        
    })
});



// SECONDARYAPPLICATION
// PERSONAL DETAILS
const applicantsnames = document.getElementById('applicantsnames')
const applicantsohoneno = document.getElementById('applicantsohoneno')
const genderselect = document.getElementById('genderselect')
const countyselect = document.getElementById('countyselect')
const wardinout = document.getElementById('wardinout');

const applicantsschoolname = document.getElementById('applicantsschoolname')
const applicantsadmissionno = document.getElementById('applicantsadmissionno')
const applicantsYOS = document.getElementById('applicantsYOS')
const applicantsfeebalance = document.getElementById('applicantsfeebalance')


const Guardianname = document.getElementById('Guardianname')
const GuardianPhoneno = document.getElementById('GuardianPhoneno')
const income = document.getElementById('income')
const GuardianId = document.getElementById('GuardianId')


const resultsuplaods = document.getElementById('resultsuplaods')
const admisionletter = document.getElementById('admisionletter')
const birthcertuplaods = document.getElementById('birthcertuplaods')
const Deathcertuplaods = document.getElementById('Deathcertuplaods')
const chiefletteruplaods = document.getElementById('chiefletteruplaods')
const feestatement = document.getElementById('feestatement')

const submitapplication  =document.getElementById('submitapplication');

const secondaryresults = document.getElementById('secondaryresults');

submitapplication.addEventListener('click',()=>{

const formdata = new FormData();
formdata.append('APPLICANTNAME', applicantsnames.value.trim());
formdata.append('APPLICANTPHONE', applicantsohoneno.value.trim());
formdata.append('GENDER', genderselect.value);
formdata.append('COUNTY', countyselect.value);
formdata.append('WARD', wardinout.value);

// Institution Details
formdata.append('SCHOOLNAME', applicantsschoolname.value.trim());
formdata.append('ADMISSIONNO', applicantsadmissionno.value.trim());
formdata.append('YOS', applicantsYOS.value);
formdata.append('FEEBALANCE', applicantsfeebalance.value.trim());

// Guardian Details
formdata.append('GUARDIANNAME', Guardianname.value.trim());
formdata.append('GUARDIANPHONE', GuardianPhoneno.value.trim());
formdata.append('INCOME', income.value);

// Files
formdata.append('GUARDIANID', GuardianId.files[0]);
formdata.append('RESULTSSLIP', resultsuplaods.files[0]);
formdata.append('ADMISSIONLETTER', admisionletter.files[0]);
formdata.append('BIRTHCERT', birthcertuplaods.files[0]);
formdata.append('CHIEFLETTER', chiefletteruplaods.files[0]);
formdata.append('FEESTATEMENT', feestatement.files[0]);

if (Deathcertuplaods.files[0]) {
    formdata.append('DEATHCERT', Deathcertuplaods.files[0]);
}

fetch('/sieve/secondaryapplication',{
    method:'POST',
    credentials:'include',
    body:formdata,
})
.then(res=>res.json())
.then(data=>{
secondaryresults.textContent = data.message;
secondaryresults.classList.remove('hidden');

})
.catch(err=>{
    secondaryresults.textContent='something went wrong try again later';
    secondaryresults.classList.remove('hidden');
    setTimeout(() => {
        secondaryresults.classList.add('hidden');
    }, 3000);

    console.log(err);
    
})
})


// university form
const unistudentsname = document.getElementById('unistudentsname')
const uniphoneno = document.getElementById('uniphoneno')
const unicounty = document.getElementById('unicounty')
const uniward = document.getElementById('uniward')


const universityname = document.getElementById('universityname')
const regno = document.getElementById('regno')

const idcopy = document.getElementById('idcopy')
const resultscopy = document.getElementById('resultscopy')
const admisionletterforuni = document.getElementById('uniadmisionletter')
const Birthcerticate = document.getElementById('Birthcerticate')
const Deathcerticate = document.getElementById('Deathcerticate')

const Unisubmitbtn = document.getElementById('submitbtnuni')
const uniresults = document.getElementById('uniresults');
const universityfeestatement = document.getElementById('universityfeestatement')

Unisubmitbtn.addEventListener('click',() => {

    const formdata = new FormData()
    

    formdata.append('NAMES', unistudentsname.value.trim())
    formdata.append('UNIPHONENO', uniphoneno.value.trim())
    formdata.append('UNICOUNTY', unicounty.value.trim())
    formdata.append('UNIWARD', uniward.value.trim())
    formdata.append('UNIVERSITYNAME', universityname.value.trim())
    formdata.append('REGNO', regno.value.trim())
 

   
    formdata.append('IDCOPY', idcopy.files[0])
    formdata.append('RESULTSCOPY', resultscopy.files[0])
    formdata.append('ADMISSIONLETTER',admisionletterforuni.files[0])
    formdata.append('BIRTHCERT', Birthcerticate.files[0])
    formdata.append('FEESTATEMENT',universityfeestatement.files[0]);
 
    
    if(Deathcerticate.files[0]){
        formdata.append('DEATHCERT', Deathcerticate.files[0]
)}
fetch('/uniform/universityapplication',{
    method:'POST',
    credentials:'include',
    body:formdata,
}).then(res=>res.json())
.then(data=>{
    uniresults.textContent = data.message;
}).catch(err=>{
     uniresults.textContent = err.message;
})
})


// admin

const applicants = document.getElementById('applicants');
const applicantsuni = document.getElementById('applicantsuni');

async function gettotalapplicants() {
    fetch('/total/totalapplicants',{
        method:'GET',
        credentials:'include',
    }).then(res=>res.json())
    .then(data=>{
        applicants.innerHTML = `${data.message}:Total secondary applicants`;
    })
    .catch(err=>{
        applicants.innerHTML = err.message;
    })
}



async function getunilapplicants() {
    fetch('/total/universityapplicants',{
        method:'GET',
        credentials:'include',
    }).then(res=>res.json())
    .then(data=>{
        applicantsuni.innerHTML = `${data.message} :Total university applicants`;
    })
    .catch(err=>{
        applicantsuni.innerHTML = err.message;
    })
}






const pendingsecresults  = document.getElementById('pending');
const pendinguniresults = document.getElementById('pendinguni');

async function getpending() {
    fetch('/total/pendingsecondary',{
        method:'GET',
        credentials:'include',
    }).then(res=>res.json())
    .then(data=>{
        pendingsecresults.innerHTML = `${data.message} :Total secondary pending`;
    })
    .catch(err=>{
        pendingsecresults.innerHTML = err.message;
    })
}



async function pendinguni() {
    fetch('/total/pendinguniversity',{
        method:'GET',
        credentials:'include',
    }).then(res=>res.json())
    .then(data=>{
        pendinguniresults.innerHTML = `${data.message} :Total university pending `;
    })
    .catch(err=>{
        pendinguniresults.innerHTML = err.message;
    })
}




const budget = document.getElementById('budget');
const setbudget = document.getElementById('setbudget');
const BUDGET =document.getElementById('BUDGET');
const financialyear = document.getElementById('financialyear');
const budgetedcounty = document.getElementById('budgetedcounty');

setbudget.addEventListener('click',()=>{
    const SETBUDGET = budget.value.trim();
    const FINANCIALYEAR = financialyear.value;
    const BUDGETEDCOUNTY = budgetedcounty.value.trim();

    if(!SETBUDGET || !FINANCIALYEAR||!BUDGETEDCOUNTY){
        BUDGET.textContent = 'Please honourable set the fields  first';
        setTimeout(() => {
            BUDGET.classList.add('hidden')
        }, 3000);
        return;
    }
    fetch('/total/setbudget',{
        method:'POST',
        headers:{'content-Type':'application/json'},
        credentials:'include',
        body:JSON.stringify({SETBUDGET,FINANCIALYEAR,BUDGETEDCOUNTY})
    }).then(res=>res.json())
    .then(data=>{
BUDGET.textContent = data.message;
    })
    .catch(err=>{
         BUDGET.textContent = err.message;
    })
    
})

async function displaybudget() {
    fetch('/total/totalbudget',{
        method:'GET',
        credentials:'include',
    }).then(res=>res.json())
    .then(data=>{
if(!Array.isArray(data.message))return;
        data.message.forEach(county => {
        BUDGET.innerHTML+=`
        <P>County:${county.BUDGETEDCOUNTY}</p>,
       <P> Budget:${county.SETBUDGET}</p>,
        <P>Fincial year:  ${county.FINANCIALYEAR}</p>,
        <P> Time created: ${county.created_at}</p>,`  
        });
    }).catch(err=>{
        BUDGET.textContent = err.message;
    })
}



const studentsdetails = document.getElementById('studentsdetails');


async function applicantssec() {
  fetch('/total/displaysec',{
    method:'GET',
    credentials:'include',
  }).then(res=>res.json())
  .then(data=>{
    
    if(!Array.isArray(data.message))return;
      data.message.forEach(secondarystudent => {
        const row = document.createElement('tr')
        row.innerHTML = `
            <td class="px-4 py-3">${secondarystudent.APPLICANTNAME}</td>
            <td class="px-4 py-3">${secondarystudent.extractedData?.RESULTSSLIP?.admissionNo || 'N/A'}</td>
            <td class="px-4 py-3">${secondarystudent.SCHOOLNAME}</td>
            <td class="px-4 py-3">
                <span class="${
                    secondarystudent.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    secondarystudent.status === 'needs_review' ? 'bg-red-100 text-red-800' :
                    secondarystudent.status === 'suspicious' ? 'bg-red-200 text-red-900' :
                    'bg-green-100 text-green-800'
                } px-2 py-1 rounded-full text-xs font-bold">
                    ${secondarystudent.status}
                </span>
            </td>
            <td class="px-4 py-3">${new Date(secondarystudent.created_at).toLocaleDateString()}</td>
            <td class="px-4 py-3">
                <button onclick="viewapplicant(${secondarystudent.id})" 
                    class="bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-600">
                    View
                </button>
            </td>
             <td class="px-4 py-3">${secondarystudent.confidenceScore}</td>
        `
        studentsdetails.appendChild(row)
    })
  
  }).catch(err=>{
    console.log(err);
    
  })
}



const universitytable = document.getElementById('universitytable');

async function secondaryschoolapplicants() {
  fetch('/total/universitytable',{
    method:'GET',
    credentials:'include',
  }).then(res=>res.json())
  .then(data=>{
  
    if(!Array.isArray(data.message))return;
    
 data.message.forEach(applicant=>{
    const row = document.createElement('tr');
    row.innerHTML=`

     <td class="px-4 py-3">${applicant.NAMES}</td>
            <td class="px-4 py-3">${applicant.REGNO}</td>
            <td class="px-4 py-3">${applicant.UNIVERSITYNAME}</td>
            <td class="px-4 py-3">
                <span class="${
                    applicant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    applicant.status === 'needs_review' ? 'bg-red-100 text-red-800' :
                    applicant.status === 'suspicious' ? 'bg-red-200 text-red-900' :
                    'bg-green-100 text-green-800'
                } px-2 py-1 rounded-full text-xs font-bold">
                    ${applicant.status}
                </span>
            </td>
            <td class="px-4 py-3">${new Date(applicant.created_at).toLocaleDateString()}</td>
            <td class="px-4 py-3">${applicant.confidenceScore}</td>
            
        `
        universitytable.appendChild(row)
    })
    
  }).catch(err=>{
    console.log(err);
    
  })
}



const registereddetails = document.getElementById('registereddetails');

async function registeredstudents() {
    fetch('/total/regtableuni',{
        method:'GET',
        credentials:'include',
    })
    .then(res=>res.json())
    .then(data=>{
    
    if(!Array.isArray(data.message))return;
        data.message.forEach(student=>{
            const row = document.createElement('tr');
            row.innerHTML=`
            <td class="px-4 py-3">${student.NAMES}</td>
              <td class="px-4 py-3">${student.EMAIL}</td>
              <td class="px-4 py-3">${student.PHONE}</td>
                <td class="px-4 py-3">${student.role}</td>
                  <td class="px-4 py-3">${student.created_at}</td>
                
            `
             registereddetails.appendChild(row);
        })
       
        
    })
    .catch(err=>{
        console.log(err);
        
    })
}



// const uploadeddocuments = document.getElementById('uploadeddocuments');

// async function uplaodedfiles() {
//     fetch('/files',{
//         method:'GET',
//         credentials:'include',
//     }).then(res=>res.json())
//     .then(data=>{
//         uploadeddocuments.innerHTML = data.message;
//     }).catch(err=>{
//          uploadeddocuments.innerHTML = err.message;
//     })
// }
// uplaodedfiles()

homebutton.addEventListener('click',()=>{
    adminDashboard.classList.add('hidden');
    studentDashboard.classList.remove('hidden');

})

const search =document.getElementById('search');
const searchbtn = document.getElementById('searchbtn');


searchbtn.addEventListener('click',()=>{
    const SearchEl = search.value.trim();
    if(!SearchEl){
        alert(`please search by name first`);
        return;
    }
    fetch(`/total/searchfunc?SearchEl=${SearchEl}`,{
        method:'GET',
        credentials:'include',
    })
    .then(res=>res.json())
    .then(data=>{
        console.log(data);
        
        studentsdetails.innerHTML = '';
         if(data.message.length === 0){
         if(!Array.isArray(data.message)) return 
        studentsdetails.innerHTML = `
            <tr>
                <td colspan="6" class="px-4 py-8 text-center text-gray-400">
                    No results found for "${SearchEl}"
                </td>
            </tr>`
        return
    }
         data.message.forEach(applicant => {
        const row = document.createElement('tr')
        row.innerHTML = `
            <td class="px-4 py-3">${applicant.APPLICANTNAME}</td>
            <td class="px-4 py-3">${applicant.extractedData?.RESULTSSLIP?.admissionNo || 'N/A'}</td>
            <td class="px-4 py-3">${applicant.SCHOOLNAME}</td>
            <td class="px-4 py-3">${applicant.status}</td>
            <td class="px-4 py-3">${new Date(applicant.created_at).toLocaleDateString()}</td>
            <td class="px-4 py-3">
                <button onclick="viewapplicant(${applicant.id})"
                    class="bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-bold">
                    View
                </button>
            </td>
        `
        studentsdetails.appendChild(row)
    })
    })
    .catch(err=>{
        console.log(err);
        
    })
})

const passwordreset = document.getElementById('passwordreset');
const forgotemailfield = document.getElementById('forgotemailfield');
passwordreset.addEventListener('click',()=>{
    forgotemailfield.classList.remove('hidden')
    const emailreset = forgotemailfield.value;
    if(!emailreset){
    return;
    }

    fetch('/resetpassword/passwordreset',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({emailreset}),
    })
    .then(res=>res.json())
    .then(data=>{
        results.classList.remove('hidden');
        results.textContent = data.message;
    })
    .catch(err=>{
        console.log(err); 
        results.textContent = err.message;
        
    })
})


document.addEventListener('DOMContentLoaded',() => {

 registeredstudents();
 secondaryschoolapplicants();
 applicantssec();
 displaybudget();
 pendinguni();
 getpending();
 getunilapplicants();
gettotalapplicants();
})

const sort = document.getElementById('sort');
 sort.addEventListener('click',()=>{
const SORT = sort.value;

fetch(`/total/filterstatus?status=${SORT}`,{
    method:'GET',
    credentials:'include',
})
.then(res=>res.json())
.then(data=>{
    console.log(data);
       if(!Array.isArray(data.message)) return

    studentsdetails.innerHTML = ''

    data.message.forEach(applicant => {
      const row = document.createElement('tr')
      row.innerHTML = `
        <td class="px-4 py-3">${applicant.APPLICANTNAME}</td>
         <td class="px-4 py-3">${applicant.extractedData.admisionletter}</td>
        <td class="px-4 py-3">${applicant.SCHOOLNAME}</td>
        
        <td class="px-4 py-3">${applicant.status}</td>
          <td class="px-4 py-3">${applicant.status}</td>
          
        <td class="px-4 py-3">${new Date(applicant.created_at).toLocaleDateString()}</td>
          <td class="px-4 py-3">${applicant.confidenceScore}</td>
      `
      studentsdetails.appendChild(row)
    })
    
})
.catch(err=>{
    console.log(err);
    
})
 })