class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem('notes')) || [];
    this.title = '';
    this.text = '';

    this.$form = document.querySelector('#form');
    this.$noteTitle = document.querySelector('#note-title');
    this.$noteText = document.querySelector('#note-text');
    this.$formBtns = document.querySelector('#form-buttons');
    this.$formCloseBtn = document.querySelector('#form-close-button');
    this.$notes = document.querySelector('#notes');
    this.$note = document.querySelector('.note');
    this.$placeHolder = document.querySelector('#placeholder');
    this.$modal = document.querySelector('.modal');
    this.$modalTitle = document.querySelector('.modal-title');
    this.$modalText = document.querySelector('.modal-text');
    this.$modalCloseBtn = document.querySelector('.modal-close-button');
    this.displayNotes();
    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener('click', event => {
      this.deleteNote(event);
      this.handleFormClick(event);
      this.openModal(event);
    });

    this.$formCloseBtn.addEventListener('click', event => {
      event.stopPropagation();
      this.closeForm();
    });

    this.$modalCloseBtn.addEventListener('click', event => {
      event.stopPropagation();
      this.closeModal();
    });

    this.$form.addEventListener('submit', event => {
      event.preventDefault();
      this.addNote();
    });
  }

  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target);
    if (isFormClicked) {
      this.openForm();
    } else {
      this.addNote();
    }
  }

  openForm() {
    this.$form.classList.add('form-open');
    this.$noteTitle.style.display = 'block';
    this.$formBtns.style.display = 'block';
  }

  closeForm() {
    this.$form.classList.remove('form-open');
    this.$noteTitle.style.display = 'none';
    this.$formBtns.style.display = 'none';
    this.$noteTitle.value = '';
    this.$noteText.value = '';
  }

  selectNote(event) {
    const thisNote = event.target.closest('.note');
    const noteChildren = thisNote.children;
    const [noteTitle, noteText] = noteChildren;
    this.title = noteTitle.innerText;
    this.text = noteText.innerText;
    this.id = thisNote.dataset.id;
  }

  openModal(event) {
    if (event.target.closest('.note') && !event.target.matches('.toolbar-delete')) {
      this.selectNote(event);
      this.$modal.classList.add('open-modal');
      this.$modalTitle.value = this.title;
      this.$modalText.value = this.text;
    }
  }

  closeModal(event) {
    const updatedNote = {
      id: Number(this.id),
      title: this.$modalTitle.value,
      text: this.$modalText.value,
    };
    this.notes = this.notes.map(note => (
      note.id === Number(this.id)
        ? updatedNote
        : note));
    this.$modal.classList.remove('open-modal');
    this.displayNotes();
  }

  addNote() {
    const title = this.$noteTitle.value;
    const text = this.$noteText.value;
    const id = this.notes[0] ? this.notes[this.notes.length - 1].id + 1 : 1;
    const newNote = {
      title,
      text,
      id,
    };
    if (title || text) {
      this.notes = [...this.notes, newNote];
      this.closeForm();
    }
    this.displayNotes();
  }

  deleteNote(event) {
    if (!event.target.matches('.toolbar-delete')) return;
    this.selectNote(event);
    this.notes = this.notes.filter(note => (
      note.id !== Number(this.id)));
    this.displayNotes();
  }

  saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  displayNotes() {
    this.saveNotes();
    this.$placeHolder.style.display = this.notes ? 'none' : 'flex';
    const notes = this.notes.map(note => `
      <div class='note' data-id="${note.id}">
        <p class="${note.title && 'note-title'}"}>${note.title}</p>
        <p class="note-text"}>${note.text}</p>
        <div class="toolbar-container">
          <div class="toolbar">
            <img class="toolbar-delete" src="https://icon.now.sh/delete">
          </div>
        </div>
      </div>
    `).join('');
    this.$notes.innerHTML = notes;
  }
}

new App();
