/** (1)
  Create an input field and a button when the button is clicked 
  call  function that receives 'number' as a parameter (from input field) 
  and returns a new promise after 2 sec
  If the number is above 17 display on the screen 'You can drive' 
  and if it's smaller throw error and display on the screen 'You're too young to drive'
 */
//! Check yourself once with .then .catch and once with async await
//! DRY
// //! Small functions

// const input = document.querySelector('#input')
// const button = document.querySelector('#submit')
// const h1 = document.querySelector('h1')

// function setEvents(){
//    button.addEventListener('click',()=>{
//       asyncFunc(input.value)
      // thenCatch(input.value)
//    });
// }
// setEvents()
// function getPromise(num){
//    if(num!==''){
//       return new Promise((resolve, reject)=>{
//       setTimeout(() => {
//          num >= 17 ? resolve('You can drive') : reject("You're too young to drive")
//       }, 2000)
//       });
//    }
// }

// function thenCatch(num){
//    if(!num){
//       h1.textContent='Type Age!!!'
//       return;
//    }
//    getPromise(num)
//       .then((res)=>h1.textContent=res)
//       .catch((rej)=>h1.textContent=rej)
// }

// async function asyncFunc(num){
//    try{
//       if(!num) throw Error ('Type Age!')
//       const result = await getPromise(num)
//       h1.textContent=result
//    }
//    catch(err){
//       h1.textContent=err
//    }
// }

// }
/** (2)
   create a car Market Object 
   fetch all data from the API and assign it to the carMarketObj
   add spinner to see that everything works
   and show message when done
   */
//? Do i need? https://capsules7.herokuapp.com/api/carMarket/agencies
//? Do i need? https://capsules7.herokuapp.com/api/carMarket/agencies/:id
//? Do i need? https://capsules7.herokuapp.com/api/carMarket/customers
//? Do i need? https://capsules7.herokuapp.com/api/carMarket/customers/:id: 

let set = {
    dataAll: null
}

async function fetchData(url){
    const data =  await fetch(url);
    const response = data.json();
    return response;
}

async function fetchAll() { 
    try {
        const myArr = [fetchData('https://capsules7.herokuapp.com/api/carMarket/agencies'),fetchData('https://capsules7.herokuapp.com/api/carMarket/customers'),fetchData('https://capsules7.herokuapp.com/api/carMarket/tax')];
        const dataAll = await Promise.all(myArr);
        set.dataAll = {
            agencies:dataAll[0],
            customers:dataAll[1],
            taxAuthoreties: dataAll[2]
        }
        return set.dataAll;
    }
    catch(e) {
        console.log(e);
    }
}

async function startApp() {
    isLoading(true);
    const some = await fetchAll();
    isLoading(false);
    return some;
}


function isLoading (bol){
    if(!bol) {
        spinner.style.display = 'none';
    }
    else {   
        spinner.style.display='block'
    }
}

const spinner = document.querySelector('.spinner');
const agenciesBtn = document.querySelector('.agenciesBtn');
const customersBtn = document.querySelector('.customersBtn');
const agenciesList = document.querySelector('.agenciesList');
const customersList = document.querySelector('.customersList');
const agenciesHeading = document.getElementById('agenciesHeding');
const customersHeding = document.getElementById('customersHeding');
const overlay = document.querySelector('.overlay');
const card = document.querySelector('.card');
const closeBtn =document.querySelector('.closeBtn');

//? Create two button on the screen "Customers" "Agencies"
//? When the user clicks the button display a list of Customers / Agencies names
//? Only one list can be presented at a time

async function agenciesHandler(event) {
    agenciesList.style.display = 'block';
    customersList.style.display = 'none';
    const objFromAPI = await startApp();
    const {agencies,customers,taxAtreties} = objFromAPI;
    agenciesList.replaceChildren('');
    createAndAppend(getName(agencies),agenciesList,getId(agencies));
}

async function customersHandler(event) {
    agenciesList.style.display='none';
    customersList.style.display='block';
    const objFromAPI = await startApp();
    const {agencies,customers,taxAtreties} = objFromAPI;
    customersList.replaceChildren('');
    createAndAppend(getName(customers),customersList,getId(customers));
}

function createAndAppend (arr,list,dataId) {
        arr.forEach((keyVarElement,index) => {
            let listItem = document.createElement('li');
            listItem.innerText = keyVarElement;
            listItem.setAttribute('data-name', keyVarElement);
            listItem.setAttribute('data-id', dataId[index]);
            list.appendChild(listItem);
        });
}

function getName(keyVar) {
    const myArr = [];
    for(let obj of keyVar){
        const nameAndId = Object.keys(obj);
        const[name,id] = nameAndId;
        myArr.push(obj[name]); 
    }
    return myArr;
}
function getId(keyVar) {
    const myArr = [];
    for(let obj of keyVar){
        const nameAndId = Object.keys(obj);
        const[name,id] = nameAndId;
        myArr.push(obj[id]);
    }
    return myArr;
}

function setEvents (){
    agenciesBtn.addEventListener('click',agenciesHandler);
    customersBtn.addEventListener('click',customersHandler);
    agenciesList.addEventListener('click',ListHandler);
    customersList.addEventListener('click',ListHandler);
}

setEvents();

function ListHandler(event) {
    let targetId = event.target.getAttribute('data-id');
    const idsArr = [getId(set.dataAll.agencies) ,getId(set.dataAll.customers)].flat();
    for (const Id of idsArr) {
        if(Id == targetId){
            overlay.classList.toggle('hidden');
            let parentCustomers = event.target.parentElement.classList.contains('customersList');
            let parentAgencies = event.target.parentElement.classList.contains('agenciesList');
            if(parentCustomers){
                createAndAppendCustomerCard(fetchAgencyORcustomer(Id));
                    return;
                }
                else if(parentAgencies){
                    createAndAppendAgencyCard(fetchAgencyORcustomer(Id));
                }
        }
    }
}

async function fetchAgencyORcustomer(str) {
    try {   
        const myArr = [fetchAgencyById(str),fetchCustomerById(str)];
        const response = await Promise.any(myArr);
        return response
}
    catch(e) {
        console.error(e)
    };
}

async function fetchAgencyById(str){
    const agency = await fetchData(`https://capsules7.herokuapp.com/api/carMarket/agencies/${str}`);
    return agency;
}
async function fetchCustomerById(str){
    const customer = await fetchData(`https://capsules7.herokuapp.com/api/carMarket/customers/${str}`);
    return customer;
}

async function createAndAppendAgencyCard(obj) { 
    const myobj = await obj;
    let name1 = document.createElement('div');
    name1.innerText = myobj.agencyName;
    let cash = document.createElement('div');
    cash.innerText = `${myobj.cash} $`;
    let cars = document.createElement('div');
    const brandsArr = Object.keys(myobj.cars);
    for(let brand of brandsArr) {
        cars.innerText += `${brand}  : ${getName(myobj.cars[brand])}, `;
    }
    card.appendChild(name1);
    card.appendChild(cash);
    card.appendChild(cars);
}

async function createAndAppendCustomerCard(obj) { 
    const myobj = await obj;
    let name1 = document.createElement('div');
    name1.innerText=myobj.name;
    let cash = document.createElement('div');
    cash.innerText=`${myobj.cash} $`;
    let cars;
    let carTitle;
    let price ;
    let year ;
    card.appendChild(name1);
    card.appendChild(cash);
    for(let car of myobj.cars) {
        cars = document.createElement('div');
        carTitle = document.createElement('h4');
        price =document.createElement('span');
        year =document.createElement('span');
        cars.setAttribute('data-num',`${car.carNumber}`);
        cars.setAttribute('data-model',`${car.name}`);
        year.setAttribute('data-model',`${car.name}`);
        price.setAttribute('data-model',`${car.name}`);
        carTitle.innerText = `Model : ${car.name} `;
        price.innerText = `Price :${car.price}$, `;
        year.innerText = `Year :${car.year}`;
        cars.appendChild(carTitle);
        cars.appendChild(price);
        cars.appendChild(year);
        card.appendChild(cars);
        setClasses([cars,carTitle,price,year],['cars','carTitle','price','year']);
    }
    cars.addEventListener('click',displayCarsImage);
}

async function displayCarsImage(event){
    console.log(event.target);
    const myobj =await fetchAgencyById('3J2r3Kglvs');
    const brandsArr = Object.keys(myobj.cars);
    let model =event.target.getAttribute('data-model').toLowerCase();
    let imagePromisesArr =[];
    for(let brand of brandsArr) {
        brand = brand.toLowerCase();
        model = model.toLowerCase();
        const imageRes = fetchData(`https://capsules7.herokuapp.com/api/carMarket/img/${brand}/${model}`);
        imagePromisesArr.push(imageRes);
    }
    const imageResposnes = (await Promise.all(imagePromisesArr));
    for(let promise of imageResposnes){
        if(promise.image){
        card.style.background=`url(${promise.image}) center center/cover no-repeat`;
        return;
    }}
}

closeBtn.addEventListener('click',()=>{
    overlay.classList.toggle('hidden');
    card.replaceChildren(closeBtn);
    card.style.background ='#f4f4f4';
})

function setClasses(arr,arr2) {  
    arr.forEach((htmlElement,index)=>{
        htmlElement.classList.add(arr2[index]);
    }); 
}
//? (4)
//? When the user clicks on single name of a Customer / Agency
//? Show over the screen a card with all the data of that particular Customer / Agency
//! Questions we should ask ourselves:
//! Where functions can be combined into one function?
//! Am I holding unnecessary information in the client's browser?
//! Why did I choose to call the API the way I did?
//* You can divide the work inside the capsule and share the responsibility
//* Separate the functions of logic and The functions related to HTML
//* Don't mess with the design (CSS)

//? (5)
//? When the user clicks on get image of the car fetch the car image and display another card with the image.
//! but what if i did no get the image ?????

//? ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// https://capsules7.herokuapp.com/api/carMarket/img/:brand/:model

//! Questions we should ask ourselves:
//! Where functions can be combined into one function?
//! Am I holding unnecessary information in the client's browser?
//! Why did I choose to call the API the way I did?

//* You can divide the work inside the capsule and share the responsibility
//* Separate the functions of logic and The functions related to HTML
//* Don't mess with the design (CSS)
