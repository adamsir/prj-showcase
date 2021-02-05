"use strict";

document.addEventListener("DOMContentLoaded", function() {
    let inputs = document.getElementsByTagName('input');

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].className !== 'vTextField')
            continue;

        let span = document.createElement('span');
        span.style['margin-left'] = '10px';
        span.innerHTML = inputs[i].value.length + ' / ' + inputs[i].maxLength;
        span.setAttribute('id', inputs[i].name + '_length');

        inputs[i].parentNode.insertBefore(span, inputs[i].nextSibling);
        inputs[i].addEventListener('input', calculate_length);
    }
});

function calculate_length() {
       let len_span = document.getElementById(this.name + '_length');
       len_span.innerHTML = this.value.length + ' / ' + this.maxLength;
}

