const $ = require("jquery");

exports.updateScroll = (elementId) => {
  let element = document.getElementById(elementId);
  element.scrollTop = element.scrollHeight;
};

exports.clickOutsideToClose = (id, setShowCallback) => {
  console.log(`${id.slice(1)} clickOutsideToClose`);

  if (!($(id).is(":focus") || $(id).find(":focus").length)) {
    setShowCallback(false);
  }
};

exports.keydownToClose = (e, setShowCallback, label) => {
  console.log(`${label} keydownToClose`, e.keyCode, e.which);

  let exitKeyCodes = [13, 27, 32];

  if (exitKeyCodes.includes(e.keyCode) || exitKeyCodes.includes(e.which)) {
    setShowCallback(false);
  }
};

exports.addListenerForKeydownEnterToSend = (
  label,
  input,
  button,
  itemToHaveFocus
) => {
  let inputEvent = `keydown.${label}`;

  $(input).on(inputEvent, function (e) {
    if ($("#Alert").length) {
      e.preventDefault();
      return;
    }

    if (
      !itemToHaveFocus ||
      $(itemToHaveFocus).is(":focus") ||
      $(itemToHaveFocus).find(":focus").length
    ) {
      if ((e.which === 13 || e.keyCode === 13) && !e.shiftKey) {
        e.preventDefault();
        $(button).click();
      }
    }
  });
};

exports.selectText = (document, id) => {
  const el = document.getElementById(id);
  el.select();
  el.setSelectionRange(0, 99999);
};

exports.putSplash = (a, e, splashClass, time) => {
  $(e.target).addClass(`${a[splashClass]}`);
  setTimeout(() => {
    $(e.target).removeClass(`${a[splashClass]}`);
  }, { 1: 250, 2: 500, 3: 1000 }[time]);
};

exports.splash = (a, IDs, size = 2, time = 1, color = "blue") => {
  let splashColor = color[0].toUpperCase() + color.slice(1);
  let splashClass = `splash${splashColor}S${size}T${time}`;

  if (typeof IDs === "string") {
    IDs = [IDs];
  }

  IDs.forEach((id) => {
    $(id).removeClass(`${a[splashClass]}`);

    $(id).on("click", function (e) {
      exports.putSplash(a, e, splashClass, time);
    });
  });
};
