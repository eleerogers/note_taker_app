class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem('notes')) || [];
    this.title = null;
    this.text = null;
    this.id = null;
    this.$form = document.querySelector("#form");
    this.$noteTitle = document.querySelector("#note-title");
    this.$noteText = document.querySelector("#note-text");
    this.$formButtons = document.querySelector("#form-buttons");
    this.$notes = document.querySelector('#notes');
    this.$note = document.querySelector('#note');
    this.$placeholder = document.querySelector('#placeholder');
    this.$formCloseBtn = document.querySelector('#form-close-button');
    this.$modal = document.querySelector('.modal');
    this.$modalTitle = document.querySelector('.modal-title');
    this.$modalText = document.querySelector('.modal-text');
    this.$modalCloseBtn = document.querySelector('.modal-close-button');
    this.$toolbarDelete = document.querySelector('.toolbar-delete');
    this.addEventListeners();
    this.saveNotes();
  }

  addEventListeners() {
    document.body.addEventListener('click', event => {
      this.deleteNote(event)
      this.handleFormClick(event);
      this.handleNoteClick(event);
    });
    this.$form.addEventListener('submit', event => {
      this.handleSubmitForm(event);
    })
    this.$formCloseBtn.addEventListener('click', event => {
      event.stopPropagation();
      this.closeForm();
    })
    this.$modalCloseBtn.addEventListener('click', event => {
      this.closeModal();
    })
  }

  handleFormClick(event) {
    if (this.$form.contains(event.target)) {
      this.openForm();
    } else {
      this.handleSubmitForm();
    }
  }

  selectNote(event) {
    const thisNote = event.target.closest('.note');
    if (thisNote) {
      this.id = thisNote.dataset.id;
      const thisNoteData = this.notes.find(note => Number(note.id) === Number(this.id));
      this.title = thisNoteData.title;
      this.text = thisNoteData.text;
    }
    return thisNote
  }

  handleNoteClick(event) {
    if (event.target.matches('.toolbar-delete')) return;
    const thisNote = this.selectNote(event);
    if (thisNote) {
      this.$modal.classList.add('open-modal');
      this.$modalTitle.value = this.title;
      this.$modalText.value = this.text;
    }
  }

  saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
    this.displayNotes();
  }

  closeModal() {
    this.title = this.$modalTitle.value;
    this.text = this.$modalText.value;
    this.notes = this.notes.map(note => {
      if (Number(note.id) === Number(this.id)) {
        return {
          ...note,
          title: this.title,
          text: this.text,
          id: this.id
        }
      } else {
        return note;
      }
    })
    this.saveNotes()
    this.$modal.classList.remove('open-modal');
  }

  handleSubmitForm() {
    event.preventDefault();
    const title = this.$noteTitle.value;
    const text = this.$noteText.value;
    if (title || text) {
      this.addNote({title, text})
    } else {
      this.closeForm();
    }
  }

  openForm(event) {
    this.$form.classList.add("form-open");
    this.$noteTitle.style.display ="block";
    this.$formButtons.style.display = "block";
  }

  closeForm(event) {
    this.$noteTitle.value = "";
    this.$noteText.value = "";
    this.$form.classList.remove("form-open");
    this.$noteTitle.style.display ="none";
    this.$formButtons.style.display = "none";
  }

  addNote(note) {
    let newId;
    if (this.notes.length > 0) {
      newId = this.notes[this.notes.length - 1].id + 1;
    } else {
      newId = 1;
    }
    const noteWithId = {...note, id: newId};
    this.notes = [...this.notes, noteWithId];
    this.saveNotes();
    this.closeForm();
  }

  displayNotes() {
    this.$placeholder.style.display = this.notes.length > 0 ? "none" : "flex";

    this.$notes.innerHTML = this.notes.map(note => {
      return `<div class="note" data-id=${note.id}>
        <p class="${note.title && 'note-title'}">${note.title}</p>
        <p class="note-text">${note.text}</p>
        <div class="toolbar-container">
            <div class="toolbar">
              <img class="toolbar-delete" src="https://icon.now.sh/delete">
            </div>
          </div>
      </div>`
    }).join('')
  }

  deleteNote(event) {
    event.stopPropagation();
    if (!event.target.matches('.toolbar-delete')) return;
    this.selectNote(event);
    this.notes = this.notes.filter(note => Number(note.id) !== Number(this.id));
    this.saveNotes();
    
  }
}

new App();