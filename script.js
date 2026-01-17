const nextBtn = document.querySelectorAll(".nextStep");
const stepNumber = document.querySelectorAll(".stepNumber");
const formContent = document.querySelector(".formContent");
const backBtn = document.querySelectorAll(".backBtn")
const switchToggle = document.querySelector(".checkbox")
const plans = document.querySelectorAll(".planItem")
const addsCheckbox = document.querySelectorAll(".addCheck")
const nameInput = document.getElementById("name")
const email = document.getElementById("email")
const number = document.getElementById("number")
const personalBtn = document.querySelector(".personalBtn")
const freeMonth = document.querySelectorAll(".free")
const planPrice = document.querySelectorAll(".planPrice")
const planName = document.querySelector(".planName")
const price = document.querySelector(".price")
const errorContainer = document.querySelector(".errorContainer")

const nameRegex  = /^$|^[\p{L}]+([\p{L}' -]*[\p{L}]+)*$/u;
const phoneRegex = /^$|^\+?\d{1,4}?[-.\s]?\d{6,14}$/;
const emailRegex = /^$|^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


function firstStepValidation(champ,regEX){
  const error = champ.previousElementSibling.querySelector(".error");

  if (champ.value.trim() === "") {
    error.textContent = `${champ.id} is required`;
    error.classList.remove("hidden");
    champ.style.border = "2px solid red";
    return false;
  }

  if (!regEX.test(champ.value.trim())) {
    error.textContent = "Invalid format";
    error.classList.remove("hidden");
    champ.style.border = "2px solid red";
    return false;
  }

  error.classList.add("hidden");
  champ.style.border = "none";
  return true;
}

[nameInput, email, number].forEach((input) => {
  input.addEventListener("input", () => {
    firstStepValidation(
      input,
      input === nameInput
        ? nameRegex
        : input === email
        ? emailRegex
        : phoneRegex
    );
  });
});



  function thirdStepValidation() {
  const test =  [...addsCheckbox].some(checkbox => checkbox.checked);
  if(test){
    errorContainer.classList.add("hidden")
    return true
  }else{
    errorContainer.classList.remove("hidden")
      return false
    }
  }

addsCheckbox.forEach(element=>{
  element.addEventListener("change",function(e){
    if(this.checked){
      const addContainer = this.parentElement;
      addContainer.classList.add("selected")
    }else{
      const addContainer = this.parentElement;
      addContainer.classList.remove("selected")
    }
  })
})

addsCheckbox.forEach(ele=>{
  ele.addEventListener("change",function(){
    thirdStepValidation()
  })
})

switchToggle.addEventListener("change",function(e){
  const year = document.querySelector(".year")
  const month = document.querySelector(".month")
  const per = document.querySelector(".per")
  if(this.checked){
    e.target.value = "Yearly"
    year.classList.add("onMode")
    month.classList.remove("onMode")
    freeMonth.forEach(element=>{
      element.classList.remove("hidden")
    })
    planPrice.forEach(ele=>{
      ele.textContent = "$" + (parseInt(ele.textContent.match(/\d+/)[0])*10)+"/yr"
    })
    per.textContent = "Total(per year)"
     addsCheckbox.forEach(ele=>{
       const priceElement = ele.parentElement.querySelector("span");
      priceElement.textContent = "+$"+parseInt(priceElement.textContent.match(/\d+/)[0]*10)+"/mo"})
  }else{
    e.target.value = "Monthly"
    year.classList.remove("onMode")
    month.classList.add("onMode")
    freeMonth.forEach(element=>{
      element.classList.add("hidden")
    })
    planPrice.forEach(ele=>{
      ele.textContent = "$" + (parseInt(ele.textContent.match(/\d+/)[0])/10)+"/yr"
       per.textContent = "Total(per month)"
    })
    addsCheckbox.forEach(ele=>{
       const priceElement = ele.parentElement.querySelector("span");
      priceElement.textContent = "+$"+parseInt(priceElement.textContent.match(/\d+/)[0]/10)+"/mo"})
  }
  }
)

let step = 1;

function activeStep(step) {
  // STEP NUMBERS
  stepNumber.forEach(el => {
    el.classList.remove("active");
    if (parseInt(el.textContent.trim()) === step) {
      el.classList.add("active");
    }
  });

  // FORM CONTENT
  [...formContent.children].forEach(section => {
    if (section.classList.contains(`step-${step}`)) {
      section.classList.remove("hidden");
    } else {
      section.classList.add("hidden");
    }
  });
}

nextBtn.forEach(btn => {
  btn.addEventListener("click", () => {
    if(step === 1){
      const valid = firstStepValidation(nameInput,nameRegex) && firstStepValidation(email,emailRegex) && firstStepValidation(number,phoneRegex);
      if(!valid){
        return;
      }
    }
    if(step === 3 && !thirdStepValidation()){
      return;
    }
    step++;
    if (step > stepNumber.length+1) {
      step = 1;
    }
    activeStep(step);
    finishStep()
  });
});

backBtn.forEach(element=>{
    element.addEventListener("click",function(){
        step--;
        if(step< 0){
            step = 0;
        }
        activeStep(step)
    })
})

plans.forEach(element=>{
  element.addEventListener("click",function(){
    plans.forEach(ele=>{
      ele.classList.remove("selected")
    })
    element.classList.add("selected")
  })
})


function finishStep(){
  const options = document.querySelector(".options")
  const total = document.querySelector(".total")
  const per = document.querySelector(".per")
  const totalPrice = total.querySelector(".price")
  let totalP = 0;
  options.innerHTML = ""
  plans.forEach(ele=>{
    if(ele.classList.contains("selected")){
      planName.textContent = `${ele.querySelector("span").textContent}(${switchToggle.value})`
      price.textContent = `${ele.querySelector(".planPrice").textContent}`
      totalP = totalP + parseInt(price.textContent.match(/\d+/)[0])
    }
  })
  addsCheckbox.forEach(ele=>{
    if(ele.checked){
      const addName = ele.parentElement.querySelector("h3").textContent
      const addPrice = ele.parentElement.querySelector("span").textContent
      const div = document.createElement("div")
      div.classList.add("option")
      div.innerHTML = `<p>${addName}</p>
      <p class="price">${addPrice}</p>`
      options.append(div)
      totalP = totalP + parseInt(addPrice.match(/\d+/)[0])
    }
  })
  totalPrice.textContent = `${totalP}$/mo`
}
document.querySelector(".changePlan").addEventListener("click", (e) => {
  e.preventDefault();
  step = 2;
  activeStep(2);
});

finishStep()

