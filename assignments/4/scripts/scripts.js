const display = document.getElementById("display");



const pm = document.getElementById("pm");

function togglePM() {
    const pm = document.getElementById("pm");

    pm.classList.toggle("active");
}

function appendToDisplay(input){
    
    if (pm.classList.contains("active") && /^[0-9]$/.test(input)){
        display.value += "-" + input;
        pm.classList.remove("active");
    }
    else {
        display.value += input;
    }
}

function clearDisplay(){
    display.value = "";
}

function calculate(){
    try{
        display.value = eval(display.value)
    }
    catch(error){
        display.value = "Error";
    }
    
}

function gcd(a, b) {
  if (b === 0) {
    return a;
  } else {
    return gcd(b, a % b);
  }
}

function calcGCD(){
    try{
        const [num1, num2] = display.value.split(",").map(Number);
        display.value = gcd(num1, num2);
    }
    catch(error){
        display.value = "Error";
    }
}

