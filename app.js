class App {
  constructor() {
    console.log('app works!')
    this.$form = document.querySelector("#form");
    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener('click', event => {
      this.handleFormClick(event);
    });
    
  }

  handleFormClick(event) {
    if (this.$form.contains(event.target)) {
      this.openForm();
    } else {
      this.closeForm();
    }
  }

  openForm(event) {
    
  }

  closeForm(event) {

  }
}

new App();