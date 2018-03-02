importScripts('./calculations.js');


onmessage = function(e) {
    console.log('Message received!');
    console.log(e.data);    
    console.log(Calculation);
}
