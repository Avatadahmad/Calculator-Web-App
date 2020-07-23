const $input = document.querySelector("input");
const decimal = document.getElementById("decimal");
const res = document.getElementById("eq__key");
const chatMessages = document.querySelector(".chat-messages");
const socket = io();

var $decimalMode = false;
var $operatorFlag = false;

// Get user name from url
const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("joinRoom", username);

//display result
socket.on("message", (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Get all numbers(keys)
document.querySelectorAll(".num__key").forEach((el) => {
  el.onclick = () => {
    if (isNaN(parseFloat($input.value))) {
      $input.value = "0";
    }
    if ($decimalMode) {
      $decimalMode = false;
      if ($operatorFlag) {
        $operatorFlag = false;
        $input.value = "0";
      }
      $input.value = parseFloat($input.value + "." + el.innerText);
    } else {
      if ($operatorFlag) {
        $operatorFlag = false;
        $input.value = el.innerText;
      } else {
        $input.value =
          $input.value !== "0" ? $input.value + el.innerText : el.innerText;
      }
    }
    if (document.querySelector(`.op__key.active`)) {
      document.querySelector(`.op__key.active`).classList.remove("active");
    }
  };
});

const buffer = [];

const opCallback = (opName) => () => {
  let currentVal = parseFloat($input.value);
  $operatorFlag = !$operatorFlag;
  if (opName === "percent") {
    currentVal *= 0.01;
    $input.value = currentVal;
  } else {
    if (buffer && buffer.length) {
      buffer.push({ value: currentVal });

      const result = evaluate(buffer);

      buffer.push({ value: result });
      buffer.push({ value: opName });
      $input.value = result;
    } else {
      buffer.push({ value: currentVal });
      buffer.push({ value: opName });
      $input.value = currentVal;
    }
  }
  document.querySelector(`.op__key[op=${opName}]`).classList.add("active");
};
// Mathematical Operations and Get all operands and operator to display on the log

const evaluate = (buffer) => {
  const secondOperand = buffer.pop().value;
  const operator = buffer.pop().value;
  const firstOperand = buffer.pop().value;

  switch (operator) {
    case "add":
      var operator_new = "+";
      var decimalValue = firstOperand + secondOperand;
      if (decimalValue == Math.floor(decimalValue)) {
        decimalValue = decimalValue;
      } else {
        decimalValue = decimalValue.toFixed(2);
      }

      return [firstOperand, secondOperand, operator_new, decimalValue];
      break;
    case "subtract":
      var operator_new = "-";
      var decimalValue = firstOperand - secondOperand;
      if (decimalValue == Math.floor(decimalValue)) {
        decimalValue = decimalValue;
      } else {
        decimalValue = decimalValue.toFixed(2);
      }
      return [firstOperand, secondOperand, operator_new, decimalValue];
      break;
    case "multiply":
      var operator_new = "x";
      var decimalValue = firstOperand * secondOperand;
      if (decimalValue == Math.floor(decimalValue)) {
        decimalValue = decimalValue;
      } else {
        decimalValue = decimalValue.toFixed(2);
      }
      return [firstOperand, secondOperand, operator_new, decimalValue];
      break;
    case "divide":
      var operator_new = "÷";
      if (secondOperand === 0) {
        return false;
      }
      var decimalValue = firstOperand / secondOperand;
      if (decimalValue == Math.floor(decimalValue)) {
        decimalValue = decimalValue;
      } else {
        decimalValue = decimalValue.toFixed(2);
      }
      return [firstOperand, secondOperand, operator_new, decimalValue];
      break;
    default:
      return secondOperand;
  }
};

for (const opName of ["add", "subtract", "multiply", "divide", "percent"]) {
  document.querySelector(`.op__key[op=${opName}]`).onclick = opCallback(opName);
}

// After equal key is pressed
document.querySelector(".eq__key").onclick = () => {
  if (buffer && buffer.length) {
    buffer.push({ value: parseFloat($input.value) });

    let value = evaluate(buffer);
    const firstOperand_display = value[0];
    const operator_display = value[2];
    const secondOperand_display = value[1];

    $input.value = value[3];

    var res =
      firstOperand_display.toString() +
      operator_display.toString() +
      secondOperand_display.toString() +
      "=" +
      $input.value.toString();

    socket.emit("message", res);
    $operatorFlag = false;
  }
  if (document.querySelector(`.op__key.active`)) {
    document.querySelector(`.op__key.active`).classList.remove("active");
  }
};

document.querySelector(".op__key[op=clear]").onclick = () => {
  $input.value = 0;
  buffer.length = 0;
};

document.querySelector(".op__key[op=negate]").onclick = () =>
  ($input.value = -parseFloat($input.value));

document.querySelector(".dec__key").onclick = () => {
  $decimalMode = true;
  if (document.querySelector(`.op__key.active`)) {
    document.querySelector(`.op__key.active`).classList.remove("active");
  }
};

// Display messages on the client screen(refered as chat-message because its same as chat app)
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.userName} <span>${message.time}</span></p><p class="text"> ${message.text}</p>`;

  document.querySelector(".chat-messages").appendChild(div);
}
