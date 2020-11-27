import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {MDCTopAppBar} from '@material/top-app-bar';
import {MDCDrawer} from '@material/drawer';

function AppBar(props) {
  return (
    <header className="mdc-top-app-bar app-bar" id="app-bar">
      <div className="mdc-top-app-bar__row">
        <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <button className="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button">menu</button>
          <span className="mdc-top-app-bar__title">Todo List</span>
        </section>
      </div>
    </header>
  );
}

class Sidebar extends React.Component {
  render() {
    return (
      <aside className="mdc-drawer mdc-drawer--dismissible mdc-top-app-bar--fixed-adjust">
        <div className="mdc-drawer__content">
          <div className="mdc-list todo-labels-list">
          </div>
        </div>
      </aside>
    );
  }
}

class TodoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
    };

    this.removeHandler = this.removeHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  componentDidMount() {
    const sampleItems = [
      {
        id: "aiirx7-qutypr",
        text: 'Asdf',
        date: null,
        done: true,
        labels: []
      },
      {
        id: "md1b5n-scir09",
        text: 'qwerty',
        date: null,
        done: false,
        labels: []
      },
      {
        id: "tmyufq-85jsx7",
        text: 'xxxxxx',
        date: null,
        done: true,
        labels: []
      },
    ];

    const savedItems = localStorage.getItem('react-todo-list');

    if (savedItems == null) {
      localStorage.setItem('react-todo-list', JSON.stringify(sampleItems));
      this.setState({
        items: sampleItems
      });
    }
    else {
      this.setState({
        items: JSON.parse(localStorage.getItem('react-todo-list'))
      });
    }
  }

  removeHandler(itemId) {
    this.setState({
      items: this.state.items.filter(item => item.id !== itemId)
    });
  }

  changeHandler(itemState) {
    const itemsModified = this.state.items.map((item, index) => {
      if (item.id === itemState.id) {
        item = itemState;
      }

      return item;
    });

    this.setState({
      items: itemsModified
    });

    localStorage.setItem('react-todo-list', JSON.stringify(this.state.items));
  }

  generateItemUid() {
    return Math.random().toString(36).slice(-6) + '-' + Math.random().toString(36).slice(-6);
  }

  addItem() {
    const newItem = {
      id: this.generateItemUid(),
      text: '',
      date: null,
      done: false,
      labels: []
    };

    this.setState({
      items: this.state.items.concat(newItem)
    });

    console.log(this.state.items);
  }

  renderItem(id, state) {
    return <Item key={id} removeHandler={this.removeHandler} changeHandler={this.changeHandler} state={state} />;
  }

  render() {
    const items = this.state.items;

    const itemsRender = items.map((item, index) => {
      return (this.renderItem(item.id, item));
    });

    return (
      <div>
        <ul id="todo-list" className="mdc-list" role="group" aria-label="">
          {itemsRender}
        </ul>
        <AddItemButton onClick={this.addItem}/>
      </div>
    );
  }
}

function AddItemButton(props) {
  return (
    <button onClick={props.onClick}>Add</button>
  );
}

class Item extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = React.createRef();

    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleTextInputChange = this.handleTextInputChange.bind(this);
    this.removeIfEmpty = this.removeIfEmpty.bind(this);
  }

  componentDidMount() {
    if (this.textInput.current.isTextInputEmpty()) {
      this.textInput.current.focusTextInput();
    }
  }

  handleCheckboxChange() {
    const currentState = this.props.state;
    currentState.done = !currentState.done;
    this.props.changeHandler(currentState);
  }

  handleTextInputChange(e) {
    const currentState = this.props.state;
    currentState.text = e.target.value;
    this.props.changeHandler(currentState);
  }

  removeItem(id) {
    this.props.removeHandler(id);
  }

  removeIfEmpty(e) {
    if (e.target.value.length < 3) {
      this.removeItem(e.target.parentNode.parentNode.id);
    }
  }

  renderCheckbox() {
    return (
      <Checkbox
        done={this.props.state.done}
        onChange={this.handleCheckboxChange}
      />
    );
  }

  renderTextInput() {
    return (
      <TextInput
        ref={this.textInput}
        text={this.props.state.text}
        placeholder="Write your todo here (min. 3 characters)"
        onBlur={this.removeIfEmpty}
        onChange={this.handleTextInputChange}
      />
    );
  }

  render() {
    return (
      <li className="mdc-list-item" id={this.props.state.id} /*role="checkbox"*/><span className="mdc-list-item__ripple"></span>
        {this.renderCheckbox()}
        {this.renderTextInput()}
        <div className="mdc-chip-set mdc-chip-set--input" role="grid"></div>
        <input type="date" placeholder="YYYY-MM-dd" className="todo-date" name="todo-date" />
        <span className="mdc-list-item__meta">
          <button className="mdc-icon-button material-icons todo-delete">delete</button>
        </span>
      </li>
    );
  }
}

function Checkbox(props) {
  return (
    <span className="mdc-list-item__graphic">
      <div className="mdc-checkbox">
        <input type="checkbox"
               className="mdc-checkbox__native-control todo-status"
               onChange={props.onChange} checked={props.done}/>
        <div className="mdc-checkbox__background">
          <svg className="mdc-checkbox__checkmark" viewBox="0 0 24 24">
            <path className="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
          <div className="mdc-checkbox__mixedmark"></div>
        </div>
      </div>
    </span>
  );
}

class TextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = React.createRef();
  }

  isTextInputEmpty() {
    return this.textInput.current.value.length < 3;
  }

  focusTextInput() {
    this.textInput.current.focus();
  }

  render() {
    return (
      <div className="mdc-text-field text-field mdc-text-field--fullwidth mdc-text-field--no-label mdc-ripple-upgraded todo-input">
        <input type="text" ref={this.textInput} onBlur={this.props.onBlur} onChange={this.props.onChange} placeholder={this.props.placeholder} className="mdc-text-field__input todo-text" aria-label="" value={this.props.text}/>
      </div>
    );
  }
}

class App extends React.Component {
  componentDidMount() {
    const drawer = new MDCDrawer(document.querySelector('.mdc-drawer')),
    topAppBar = new MDCTopAppBar(document.getElementById('app-bar'));

    drawer.open = window.outerWidth >= 768;

    topAppBar.setScrollTarget(document.getElementById('main-content'));
    topAppBar.listen('MDCTopAppBar:nav', () => {
      drawer.open = !drawer.open;
    });
  }
  render() {
    return (
      <div className="app">
        <AppBar />
        <Sidebar />
        <div className="mdc-drawer-app-content mdc-top-app-bar--fixed-adjust">
          <main className="main-content" id="main-content">
            <TodoList />
          </main>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
