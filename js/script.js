var Cell = React.createClass({

    render: function () {
        var isHidden = this.props.isHidden,
            isFlagged, item,
            id = this.props.id,
            cellState = this.props.cellState,
            onClick = this.props.onClick;
        if(isHidden) {
            item =  '*'
        } else {
            item = cellState.toString()
        }

        return(
            <span className="cell" onClick={onClick}>
                {item}
            </span>
        )
    }

});

var CellFrame = React.createClass({
    getInitialState : function () {
        return {
            gameField: this.initializeField(this.props.cellsNum)
        }
    },
    initializeField: function (size) {
        var field=new Array(size);
        for (var i = 0; i < field.length; i++){
            field[i] = new Array(size);
            for (var j = 0; j < size; j++){
                field[i][j]=0;
            }
        }
        for (var x = 0, k=0; x < size; x++) {
            for (var y = 0; y < size; y++, k++) {
                if (this.props.bombs.some(function (x) {return x === k}) > 0){
                    field[x][y]="B";
                    for(var i = -1; i < 2; i++){
                        for(var j = -1; j < 2; j++){
                            if( (x+i >= 0) && (x+i < size) && (y+j >= 0) && (y+j < size)){
                                if (field[x+i][y+j] != "B")
                                    field[x+i][y+j]++;
                            }
                        }
                    }
                }
            }
        }
        return field
    },
    openCell : function (x, y) {
    let size = this.props.cellsNum;
        if (this.state.gameField[x][y] === 0) {
            // alert(x + ' ' + y);
            var m,n;
            for(var i = -1; i < 2; i++){
                for(var j = -1; j < 2; j++){
                    m = x+i;
                    n = y + j;
                    // alert(m +' ' + n)
                    if( (m >= 0) && (m < size) && (n >= 0) && (n < size)){
                        // alert(m +' '+ n);
                        if (this.state.gameField[m][n] === 0) {
                             // this.openCell(m, n);
                            // alert(m +' '+ n);
                        }
                    }
                }
            }
        }
        this.props.selectCell(x, y);
    },
    render: function () {
        var size = this.props.cellsNum,
            // bombs = this.props.bombs,
            // selectCell = this.props.selectCell,
            selectedCells = this.props.selectedCells,
            hiddenCell,
            cells = [],
            field = this.state.gameField;
        for (var i = 0, k=0; i < size; i++) {
            for (var j = 0; j < size; j++, k++) {
                    if (selectedCells.indexOf(k) <0){
                        hiddenCell = true;
                    } else {
                        hiddenCell = false;
                    }
                cells.push(<Cell cellState={field[i][j].toString()}
                                 isHidden = {hiddenCell}
                                 id = {k}
                                 onClick = {this.openCell.bind(null, i, j)}/>)
            }
        }

        return (
            <div id="cells-frame">
                <div className="well">
                    {cells}
                </div>
            </div>
        );
    }
});

var Game = React.createClass({
    getInitialState : function () {
        return {
            bombs: this.createBombs(),
            selectedCells: []
        }
    },
    selectCell: function (x, y) {
         var clickedNumber = x*this.props.cellsNum + y;
        if (this.state.selectedCells.indexOf(clickedNumber) <0 ) {
            this.setState(
                {selectedCells: this.state.selectedCells.concat(clickedNumber)}
            );
        }
    },
    createBombs: function () {
        var bombs = [];
        for (var i = 0; i < this.props.bombsNum; i++){
            var bomb = Math.floor(Math.random()*64);
            if (bombs.some(function (x) {return x === bomb})){
                while (bombs.some(function (x) {return x === bomb})){
                    bomb = Math.floor(Math.random()*64);
                }
            }
            bombs.push(bomb)
        }
        bombs.sort(function (a, b) {
            return a-b;
        });
        return bombs;
    },
    render: function () {
        var cellsNum = this.props.cellsNum;
        // this.state.bombs = this.createBombs();
        const bombs = this.state.bombs;
        var selectedCells = this.state.selectedCells;
        return(
            <div id = "game">
                <h2> Mines </h2>
                <hr/>
                {/*<displaying mines>*/}
                {bombs.toString()}
                <hr/>
                {/*<displaying mines>*/}
                {/*<displaying cells>*/}
                {selectedCells.toString()}
                <hr/>
                {/*<displaying cells>*/}
                <div className="clearfix">
                    <CellFrame cellsNum = {cellsNum}
                               bombs = {bombs}
                               selectCell = {this.selectCell}
                               selectedCells = {selectedCells}/>
                </div>

            </div>
        );
    }
});

var App = React.createClass({
    getInitialState : function () {
        return {
            cellsNum: 8,
            bombsNum: 6
        }
    },
    render: function () {
        const bombsNum = this.state.bombsNum;
        const cellsNum= this.state.cellsNum;
        return(
            <Game bombsNum = {bombsNum}
                    cellsNum = {cellsNum}/>
        );
    }
});

ReactDOM.render( <App />,
    document.getElementById('root')
);