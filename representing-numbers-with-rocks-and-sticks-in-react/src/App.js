import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import UnaryNumeralList from './unary-numeral-linked-list.js';

class Rock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.vertical) {
      return (
        <table>
          <tr>
            <td>
              <img src="rock.svg" height="30" />
              <br />
              {this.props.sticks}
            </td>
          </tr>
        </table>
      );
    }
    else {
      return (
        <td>
          <span>{this.props.isZero ? <img src="puddle.jpg" height="30" /> : <img src="rock.svg" height="30" />}</span>
          <br />
          {this.props.sticks}
          {this.props.verticalRocks}
        </td>
      );
    }
  }
}

class Stick extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <img width="21" src="stick.png" />
      </div>
    );
  }
}

class RocksAndSticksInFormation extends Component {
  getRocksAndSticksInFormation(unaryNumeralLinkedList) {
    var rocks = [];

    function* getRocks(currentNode) {
      var nextDecimalNode = currentNode.decimalNode ? currentNode.decimalNode.next : null;
      var verticalRocks = [];
      while (nextDecimalNode) {
        var sticks = [];
        for (var i = 0; i < nextDecimalNode.endCount; i++) {
          sticks.push(<Stick />);
        }

        verticalRocks.push(<Rock vertical={true} sticks={sticks} />);
        nextDecimalNode = nextDecimalNode.next;
      }

      var sticksForWholeNumberRock = [];
      if (currentNode.decimalNode) {
        for (var j = 0; j < currentNode.decimalNode.endCount; j++) {
          sticksForWholeNumberRock.push(<Stick />);
        }
      }
      yield <Rock verticalRocks={verticalRocks} sticks={sticksForWholeNumberRock} isZero={currentNode === unaryNumeralLinkedList.zero} />
    }

    function* getNegativeNumbers() {
      var currentNode = unaryNumeralLinkedList.zero.prev;
      while (currentNode) {
        yield getRocks(currentNode);
        currentNode = currentNode.prev;
      }
    }

    function* getPositiveNumbers() {
      var currentNode = unaryNumeralLinkedList.zero.next;
      while (currentNode) {
        yield getRocks(currentNode);
        currentNode = currentNode.next;
      }
    }

    var rocksInNegativeDirection = Array.from(getNegativeNumbers()).map(rockArr => Array.from(rockArr)).reverse();
    var rocksAtZeroPosition = Array.from(getRocks(unaryNumeralLinkedList.zero));
    var rocksInPositiveDirection = Array.from(getPositiveNumbers()).map(rockArr => Array.from(rockArr));
    rocks = rocksInNegativeDirection.concat(rocksAtZeroPosition).concat(rocksInPositiveDirection);
    return rocks;
  }

  render() {
    return (
      <table>
        <tr>
          {this.getRocksAndSticksInFormation(this.props.unaryNumeralLinkedList)}
        </tr>
      </table>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    var defaultNumbers = '-9.3\n7.1\n5\n0\n-9.3';
    var defaultUnaryNumeralLinkedList = new UnaryNumeralList();
    defaultUnaryNumeralLinkedList.addNumber(-9.3);
    defaultUnaryNumeralLinkedList.addNumber(7.1);
    defaultUnaryNumeralLinkedList.addNumber(5);
    defaultUnaryNumeralLinkedList.addNumber(0);
    defaultUnaryNumeralLinkedList.addNumber(-9.3);

    this.state = {
      userTypedNumbers: defaultNumbers,
      unaryNumeralLinkedList: defaultUnaryNumeralLinkedList
    };
  }

  handleKeyPress(event) {
    if (event.which === 13 || event.keyCode === 13) {
      return; //enter key only pressed, do nothing
    }

    var unaryNumeralLinkedList = new UnaryNumeralList();
    var numberArrayTypedByUser = event.target.value.split('\n').filter(n => !isNaN(n) && n.length > 0);
    numberArrayTypedByUser.forEach(n => {
      unaryNumeralLinkedList.addNumber(n.trim());
    });

    this.setState({ userTypedNumbers: event.target.value });
    this.setState({ unaryNumeralLinkedList: unaryNumeralLinkedList });
  }

  render() {
    return (
      <div className="App">
        <fieldset>
          <legend>
            Key
            </legend>
            Puddle: 0<br/><br/>
            Puddle with n stick/(s) underneath: 0 exists in list n times<br/><br/>
            Rock immediately to the right of puddle: 1<br/><br/>
            Rock immediately to the left of puddle: -1<br/><br/>
            Rock under rock 7: 7.1<br/>
        </fieldset>
        <textarea
          value={this.state.userTypedNumbers}
          onChange={this.handleKeyPress.bind(this)}
        />
        <div class="clear"></div>
        <RocksAndSticksInFormation unaryNumeralLinkedList={this.state.unaryNumeralLinkedList} />
      </div>
    );
  }
}

export default App;
