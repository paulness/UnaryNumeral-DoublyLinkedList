class UnaryNumeralNode {
    constructor() {
        this.next = undefined;
        this.prev = undefined;
        this.isPositive = undefined;
        this.decimalNode = undefined;
    }
}

class UnaryDecimalNode {
    constructor() {
        this.next = undefined;
        this.endCount = 0;
    }
}

class UnaryNumeralList extends UnaryNumeralNode {
    constructor() {
        super();
        this.zero = new UnaryNumeralNode();
        this.start = this.zero;
        this.end = this.zero;
    }

    getAllNumbersFromList() {
        var numbersFound = [];
        const insertNumbersFromNode = (currentNode, currentNumber) => {
            var nextDecimalNode = currentNode.decimalNode;
            var currentRemainderNumber = 0;
            while (nextDecimalNode) { //skip over the first node
                if (nextDecimalNode.endCount) {
                    numbersFound.push(Number(currentNumber + '.' + currentRemainderNumber));
                }
                nextDecimalNode = nextDecimalNode.next;
                currentRemainderNumber++;
            }
        }

        const getNegativeNumbers = () => {
            var count = 0;
            var currentNode = this.zero;
            while (currentNode) {
                insertNumbersFromNode(currentNode, count);
                currentNode = currentNode.prev;
                count--;
            }
        }

        const getPositiveNumbers = () => {
            var count = 0;
            var currentNode = this.zero;
            while (currentNode) {
                insertNumbersFromNode(currentNode, count);
                currentNode = currentNode.next;
                count++;
            }
        }

        getNegativeNumbers();
        getPositiveNumbers();

        return numbersFound;
    }

    addNumber(numberToAdd) {
        var isNegative = numberToAdd < 0;
        var absoluteValue = Math.abs(numberToAdd);
        var wholeNumber = Math.floor(absoluteValue);
        var remainingValue = parseInt(numberToAdd.toString().split(".")[1], 10);

        const insertUnaryTallyIntoList = (num, currentNode) => {
            while (wholeNumber > 0) {
                if (isNegative) {
                    currentNode.prev = currentNode.prev || new UnaryNumeralNode();
                    currentNode.prev.next = currentNode;
                    currentNode = currentNode.prev;
                } else {
                    currentNode.next = currentNode.next || new UnaryNumeralNode();
                    currentNode.next.prev = currentNode;
                    currentNode = currentNode.next;
                }
                wholeNumber--;
            }

            //mark end of number if this is the end (one decimal node will suffice point of zero)
            currentNode.decimalNode = currentNode.decimalNode || new UnaryDecimalNode();

            //attach any decimal values to whole number node as new list
            var currentRemainderNode = currentNode.decimalNode;
            while (remainingValue > 0) {
                if (!currentRemainderNode.next) {
                    currentRemainderNode.next = new UnaryDecimalNode();
                }

                currentRemainderNode = currentRemainderNode.next;
                remainingValue--;
            }

            currentRemainderNode.endCount++;
        }

        insertUnaryTallyIntoList(numberToAdd, this.zero);
    }
}

export default UnaryNumeralList;

//bi-directional linked list that can hold any number
//var unaryNumeralLinkedList = new UnaryNumeralList();
//var n = -1.3333333;
//unaryNumeralLinkedList.addNumber(n);
//unaryNumeralLinkedList.addNumber(2);
//unaryNumeralLinkedList.addNumber(3.9999);
//unaryNumeralLinkedList.addNumber(10.9999);
//console.log(unaryNumeralLinkedList.getAllNumbersFromList());