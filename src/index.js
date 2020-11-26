import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Sidebar extends React.Component {
  render() {
    return (
      <div>Sidebar
         <button className="mdc-button">
   <div className="mdc-button__ripple"></div>
   <span className="mdc-button__label">Text Button</span>
</button>
      </div>
    );
  }
}

class Item extends React.Component {
  handleCheckboxChange() {
    const currentState = this.props.state;
    currentState.done = !currentState.done;
    this.props.handler(currentState);
  }

  renderCheckbox() {
    return (
      <Checkbox
        done={this.props.state.done}
        onChange={() => this.handleCheckboxChange()}
      />
    );
  }

  render() {
    return (
      <li className="todo-item">
        {this.renderCheckbox()}
        {this.props.state.text}
      </li>
    );
  }
}

function Checkbox(props) {
  return (
    <div className="mdc-form-field">
      <div className="mdc-checkbox">
        <input type="checkbox"
              className="mdc-checkbox__native-control"
              id="checkbox-1"
              onChange={() => props.onChange()} checked={props.done}/>
        <div className="mdc-checkbox__background">
          <svg className="mdc-checkbox__checkmark"
              viewBox="0 0 24 24">
            <path className="mdc-checkbox__checkmark-path"
                  fill="none"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
          </svg>
          <div className="mdc-checkbox__mixedmark"></div>
        </div>
        <div className="mdc-checkbox__ripple"></div>
      </div>
      {/* <label for="checkbox-1">Checkbox 1</label> */}
    </div>
    // <input type="checkbox" onChange={() => props.onChange()} checked={props.done} />
  );
}

class TodoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
    };

    this.handler = this.handler.bind(this);

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
      this.state.items = sampleItems;
    }
    else {
      this.state.items = JSON.parse(localStorage.getItem('react-todo-list'));
    }
    console.log(this.state.items);
  }

  handler(itemState) {
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

  renderItem(id, state) {
    return <Item key={id} handler={this.handler} state={state} />;
  }

  render() {
    const items = this.state.items;

    const itemsRender = items.map((item, index) => {
      return (this.renderItem(item.id, item));
    });

    return (
      <ul>
        {itemsRender}
      </ul>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="todo-list">
          <TodoList />
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
