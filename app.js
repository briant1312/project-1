const squares = document.querySelectorAll('.square');

const playerOnePieces = []
const playerTwoPieces = []

// this variable is used to keep track of the current players turn
//it is also used when searching the availableMovesForSquares array to 
//grab the available moves for the correct player
let player = 0
let selectedPiece = null

class PlayerPiece {
    constructor(currentSquare) {
        this.currentSquare = currentSquare
        this.isAlive = true
        this.isKing = false
        this.captures = []
        this.availableMoves = []
    }
    
}

//this object is used to lookup which moves are available for each square
const availableMovesForSquares = {
    s1: [[null, null], [5, 6]],
    s2: [[null, null], [6, 7]],
    s3: [[null, null], [7, 8]],
    s4: [[null, null], [8, null]],
    s5: [[null, 1], [null, 9]],
    s6: [[1, 2], [9, 10]],
    s7: [[2, 3], [10, 11]],
    s8: [[3, 4], [11, 12]],
    s9: [[5, 6], [13, 14]],
    s10: [[6, 7], [14, 15]],
    s11: [[7, 8], [15, 16]],
    s12: [[8, null], [16, null]],
    s13: [[null, 8], [null, 17]],
    s14: [[9, 10], [17, 18]],
    s15: [[10, 11], [18, 19]],
    s16: [[11, 12], [19, 20]],
    s17: [[13, 14], [21, 22]],
    s18: [[14, 15], [22, 23]],
    s19: [[15, 16], [23, 24]],
    s20: [[16, null], [24, null]],
    s21: [[null, 17], [null, 25]],
    s22: [[17, 18], [25, 26]],
    s23: [[18, 19], [26, 27]],
    s24: [[19, 20], [27, 28]],
    s25: [[21, 22], [29, 30]],
    s26: [[22, 23], [30, 31]],
    s27: [[23, 24], [31, 32]],
    s28: [[24, null], [32, null]],
    s29: [[null, 25], [null, null]],
    s30: [[25, 26], [null, null]],
    s31: [[26, 27], [null, null]],
    s32: [[27, 28], [null, null]],
}

const createUserPieces = () => {
    for(let i = 1; i <= 12; i++) {
        const piece = new PlayerPiece(`s${i}`)
        playerTwoPieces.push(piece)
    }

    for(let i = 21; i <= 32; i++) {
        const piece = new PlayerPiece(`s${i}`)
        playerOnePieces.push(piece)
    }
}

const renderBoard = () => {
    squares.forEach(square => {
        square.innerHTML = ''
    })
    for(let piece of playerOnePieces) {
        if(piece.isAlive) {
            const playerPiece = document.createElement('div')
            const square = document.querySelector(`#${piece.currentSquare}`)
            square.appendChild(playerPiece)
            playerPiece.classList.add('player-one-piece', 'piece')
        }
    }
    for(let piece of playerTwoPieces) {
        if(piece.isAlive) {
            const playerPiece = document.createElement('div')
            const square = document.querySelector(`#${piece.currentSquare}`)
            square.appendChild(playerPiece)
            playerPiece.classList.add('player-two-piece', 'piece')
        }
    }
}

const generateAvailableMoves = (currentPlayerPieces, opponentPieces) => {
    const totalPieces = currentPlayerPieces.concat(opponentPieces)
    for(piece of totalPieces) {
        piece.captures = []
        piece.availableMoves = []
    }
    for(let piece of currentPlayerPieces) {
        //generate captures
    }
    if(currentPlayerPieces.every(piece => piece.captures.length === 0)) {
        for(let piece of currentPlayerPieces) {
            for(let square of availableMovesForSquares[piece.currentSquare][player]) {
                if(square) {
                    if(totalPieces.every(piece => piece.currentSquare !== `s${square}`)) {
                        piece.availableMoves.push(square)
                    }
                }
            }
        }
    }
}

const createPieceEventListeners = () => {
    const pieces = document.querySelectorAll('.piece')
    for(let piece of pieces) {
        piece.addEventListener('click', (e) => {
            e.stopPropagation()
            selection = piece.parentElement.id
            for(let piece of playerOnePieces.concat(playerTwoPieces)) {
                if(piece.currentSquare === selection){
                    selectedPiece = piece
                }
            }
        })
    }
}

const createSquareEventListeners = () => {
    for(let square of squares) {
        square.addEventListener('click', () => {
            if(selectedPiece) {
                if(selectedPiece.availableMoves.includes(parseInt(square.id.slice(1)))) {
                    selectedPiece.currentSquare = square.id
                    renderBoard()
                    selectedPiece = null
                    createPieceEventListeners()
                    switchTurn()
                }
            }
        })
    }
}

const switchTurn = () => {
    if(player === 0){
        player = 1
        generateAvailableMoves(playerTwoPieces, playerOnePieces)
    } else {
        player = 0
        generateAvailableMoves(playerOnePieces, playerTwoPieces)
    }
}


const initialize = () => {
    createUserPieces()
    renderBoard()
    createPieceEventListeners()
    createSquareEventListeners()
    generateAvailableMoves(playerOnePieces, playerTwoPieces)
}

initialize()