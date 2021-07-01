const form=document.querySelector('#input');
const states=form.elements.states;
const districts=form.elements.districts;
const centers=form.elements.centers;
const output=document.querySelector('#Output')
const commonInfo=document.querySelector("#ci");
const ageForm=form.elements.age;
const doseForm=form.elements.dose;
let age;
let dose;


const getEle=obj=>{
    const time=document.createElement('p');
    const fee=document.createElement('p');
    const address=document.createElement('p');
    commonInfo.innerHTML="";
    time.innerText=`From: ${obj.from} To: ${obj.to}`;
    fee.innerText=`Fee: ${obj.fee_type}`;
    address.innerText=`Address: ${obj.address}`;
    commonInfo.append(time,fee,address);
    commonInfo.classList.add('givePadding-ci');
    let doseAval;
    console.log(age,dose);
   const records=obj.sessions.filter(session=>(
    age==session.min_age_limit&&(dose===1?session.available_capacity_dose1:session.available_capacity_dose2)!==0
    ))
    if(records.length===0)
     return putError();
     records.forEach((session)=>{
      const doses=dose===1?session.available_capacity_dose1:session.available_capacity_dose2;
      makeEle(session.date,session.vaccine,doses);
     })
}

const makeEle=(date,vaccine,doses)=>{
    let dayInfo=document.createElement('p')
    let lineOne=document.createElement('p');
    let lineTwo=document.createElement('p');
    let lineThree=document.createElement('p');
    lineOne.innerText=`Date: ${date}`;
    lineTwo.innerText=`Doses Avaliable : ${doses} `;
    lineThree.innerText=`Vaccine: ${vaccine} `;
    dayInfo.append(lineOne,lineTwo,lineThree); 
    dayInfo.classList.add("card");
    output.append(dayInfo);
}

const resetDefault=()=>{
    output.classList.remove("error");
    output.innerHTML="";
    output.style.fontFamily="Arial, Helvetica, sans-serif";
}

const getTodayDate=()=>{
    const day=new Date().getDate();
    const month=new Date().getMonth();
    const year=new Date().getFullYear();
    return `${day}-${month+1}-${year}`;
}

const resetDistrict=()=>{
districts.innerHTML="";
const option1=document.createElement('option');
option1.selected=true;
option1.disabled=true;
option1.hidden=true;
option1.textContent="Select District";
districts.appendChild(option1);
}

const resetCenter=()=>{
 centers.innerHTML="";
    const option2=document.createElement('option');
    option2.selected=true;
    option2.disabled=true;
    option2.hidden=true;
    option2.textContent="Select Center";
    centers.appendChild(option2);
}
const putError=()=>{
    commonInfo.innerHTML="";
    commonInfo.classList.remove('givePadding-ci');
    output.innerHTML="";
    output.classList.add('error');
    const errorOne=document.createElement('p');
    const errorTwo=document.createElement('p');
    errorOne.innerText="Could not find any slots :(";
    errorTwo.innerText="Please try Later !";
    output.append(errorOne,errorTwo);
}

const makeOptionStates=(data)=>{
    data.forEach(({state_id,state_name})=> {
        const option=document.createElement('option');
        option.value=state_id;
        option.textContent=state_name;
        states.appendChild(option);
    });
}

const makeOptionCenters=(data)=>{
    if(data.length===0)
       putError();
   data.forEach(({center_id,name})=> {
        const option=document.createElement('option');
        option.value=center_id;
        option.textContent=name;
        centers.appendChild(option);
    });
}

const makeOptionDistricts=(data)=>{
    data.forEach(entity=> {
        const option=document.createElement('option');
        option.value=entity.district_id;
        option.textContent=entity.district_name;
        districts.appendChild(option);
    });
}

const getData=async (p)=>{
    const response=await fetch(p);
    const data=response.json();
    return data;
}

const putStates=()=>{
    getData('https://cdn-api.co-vin.in/api/v2/admin/location/states')
    .then(res=>{
        makeOptionStates(res.states);
    })
    .catch(err=>{
        console.log(err);
        putError();
    })
}

const putDistricts=()=>{
   getData(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${states.value}`)
   .then(res=>{
    makeOptionDistricts(res.districts);
})
.catch(err=>{
    console.log(err);
    putError();
})
}

const putcenters=()=>{
    getData(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districts.value}&date=${getTodayDate()}`)
    .then(res=>{
        makeOptionCenters(res.centers);
    })
    .catch(err=>{
        console.log(err);
        putError();
    })
}

const displayCenter=()=>{
    getData(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByCenter?center_id=${centers.value}&date=${getTodayDate()}`)
    .then(res=>{
        getEle(res.centers)
    })
    .catch(err=>{
        console.log(err);
        putError();
    })
}


putStates();

states.addEventListener('change',e=>{
    e.preventDefault();
    resetDistrict();
    resetCenter();
    putDistricts();
})

districts.addEventListener('change',e=>{
    e.preventDefault();
    resetCenter();
    putcenters();
})

form.addEventListener('submit',e=>{
    e.preventDefault();
    resetDefault();
    displayCenter();
   
})

ageForm.addEventListener('change',e=>{
    e.preventDefault();
    age=parseInt(ageForm.value);
   // console.log(age);
})

doseForm.addEventListener('change',e=>{
    e.preventDefault();
    dose=parseInt(doseForm.value);
    //console.log(dose);
})