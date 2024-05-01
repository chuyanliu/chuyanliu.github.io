// variable modal requires jquery
const VModal = {
  main: document.querySelector('div#vmodal-main'),
  title: document.querySelector('h5#vmodal-title'),
  body: document.querySelector('div#vmodal-body'),
  btnSave: document.querySelector('button#vmodal-save'),
  btnCancel: document.querySelector('button#vmodal-cancel'),
  onSave: null,
  onCancel: null,
  isVisible: false,
  show: function(title, content, valueElement, valueKey, saveText, cancelText, onSave, onCancel, safe = true) {
    let property = safe ? 'innerText' : 'innerHTML';
    VModal.title[property] = title;
    VModal.body.innerHTML = '';
    if (Array.isArray(content)) {
      content.forEach((e) => {
        VModal.body.appendChild(e);
      });
    } else {
      if (typeof (content) === 'object') {
        VModal.body.appendChild(content);
      } else {
        VModal.body[property] = content;
      };
    };
    VModal.btnSave[property] = saveText;
    if (cancelText) {
      VModal.btnCancel.style.display = 'block';
      VModal.btnCancel[property] = cancelText;
    } else {
      VModal.btnCancel.style.display = 'none';
    }
    if (VModal.onSave) {
      VModal.btnSave.removeEventListener('click', VModal.onSave);
    }
    if (VModal.onCancel) {
      VModal.btnCancel.removeEventListener('click', VModal.onCancel);
    }
    VModal.onSave = function() {
      if (onSave) {
        if (valueElement) {
          onSave(valueElement[valueKey]);
        } else {
          onSave();
        }
      }
      VModal.hide();
    };
    VModal.onCancel = function() {
      if (onCancel) {
        if (valueElement) {
          onCancel(valueElement[valueKey]);
        } else {
          onCancel();
        }
      }
      VModal.hide();
    };
    VModal.btnSave.addEventListener('click', VModal.onSave);
    VModal.btnCancel.addEventListener('click', VModal.onCancel);
    $('#vmodal-main').modal('show');
    VModal.isVisible = true;
  },
  hide: function() {
    $('#vmodal-main').modal('hide');
    VModal.isVisible = false;
  }
};