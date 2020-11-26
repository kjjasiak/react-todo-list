import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {MDCRipple} from '@material/ripple';

class Sidebar extends React.Component {
  componentDidMount() {
    MDCRipple.attachTo(document.querySelector('.mdc-button'));
  }

  render() {
    return (
      <div>Sidebar
         <button class="mdc-button">
   <div class="mdc-button__ripple"></div>
   <span class="mdc-button__label">Text Button</span>
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
    <input type="checkbox" onChange={() => props.onChange()} checked={props.done} />
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
