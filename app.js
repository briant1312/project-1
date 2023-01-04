const squares = document.querySelectorAll('.square')
const playerOne = document.querySelector('#player-one')
const playerTwo = document.querySelector('#player-two')
const restartButton = document.querySelector('#restart-button')

let playerOnePieces = []
let playerTwoPieces = []
let totalPieces = []

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
        this.captures = null
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
    s13: [[null, 9], [null, 17]],
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
        totalPieces.push(piece)
    }

    for(let i = 21; i <= 32; i++) {
        const piece = new PlayerPiece(`s${i}`)
        playerOnePieces.push(piece)
        totalPieces.push(piece)
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

            if(piece.isKing) {
                playerPiece.classList.add('king')
                playerPiece.innerHTML = '<i class="fa-solid fa-crown"></i>'
            }
        }
    }
    for(let piece of playerTwoPieces) {
        if(piece.isAlive) {
            const playerPiece = document.createElement('div')
            const square = document.querySelector(`#${piece.currentSquare}`)
            square.appendChild(playerPiece)
            playerPiece.classList.add('player-two-piece', 'piece')

            if(piece.isKing) {
                playerPiece.classList.add('king')
                playerPiece.innerHTML = '<i class="fa-solid fa-crown"></i>'
            }
        }
    }
}

const generateAvailableMoves = (currentPlayerPieces, opponentPieces) => {
    for(piece of totalPieces) {
        //this resets these attributes so they clear out after every turn
        piece.availableMoves = []
        piece.captures = {}
    }
    for(let piece of currentPlayerPieces) {
        //loop through each users piece and check the availableMovesForSquares object
        //to see which squares are adjacent to the current pieces square
        if(piece.currentSquare) {
            getCaptures(piece, opponentPieces, player)
            if(piece.isKing) {
                getCaptures(piece, opponentPieces, player - 1)
            }
        }
    }
    //if the user has no pieces that can be captured then check for available moves
    if(currentPlayerPieces.every(piece => Object.keys(piece.captures).length === 0)) {
        for(let piece of currentPlayerPieces) {
            if(piece.currentSquare) {
                getNonCaptureMoves(piece, player)
                if(piece.isKing) {
                    getNonCaptureMoves(piece, player - 1)
                }
            }
        }
    }
}

const getCaptures = (piece, opponentPieces, index) => {
    for(let square of availableMovesForSquares[piece.currentSquare].at(index)) {
        if(square) {
            //check if any of the user pieces are on the squares adjacent to the users
            if(opponentPieces.some(piece => piece.currentSquare === `s${square}`)) {
                //if the square in question is the 1st item in the array we are jumping to the left
                //the inner conditional statements check for which user is currently playing
                if(availableMovesForSquares[piece.currentSquare].at(index).indexOf(square) === 0) {
                    if(index === 0) {
                        const edgePieces = ['s9', 's17', 's25', 's6', 's7', 's8']
                        const adjacentPiece = `s${parseInt(piece.currentSquare.slice(1)) - 9}`
                        if(totalPieces.every(piece => piece.currentSquare !== adjacentPiece)) {
                            if(!edgePieces.includes(piece.currentSquare)) {
                                piece.captures[parseInt(piece.currentSquare.slice(1)) - 9]
                                 = availableMovesForSquares[piece.currentSquare].at(index)[0]
                            }
                        }
                    } else {
                        const adjacentPiece = `s${parseInt(piece.currentSquare.slice(1)) + 7}`
                        const edgePieces = ['s1', 's9', 's17', 's25', 's26', 's27', 's28']
                        if(totalPieces.every(piece => piece.currentSquare !== adjacentPiece)) {
                            if(!edgePieces.includes(piece.currentSquare)){
                                piece.captures[parseInt(piece.currentSquare.slice(1)) + 7]
                                = availableMovesForSquares[piece.currentSquare].at(index)[0]
                            }
                        }
                    }
                    //if the square in question is not the first value in the array then
                    //we are jumping to the right
                } else { 
                    if(index === 0) {
                        const adjacentPiece = `s${parseInt(piece.currentSquare.slice(1)) - 7}`
                        const edgePieces = ['s8', 's16', 's24', 's32', 's7', 's6', 's5']
                        if(totalPieces.every(piece => piece.currentSquare !== adjacentPiece)) {
                            if(!edgePieces.includes(piece.currentSquare)) {
                                piece.captures[parseInt(piece.currentSquare.slice(1)) - 7]
                                = availableMovesForSquares[piece.currentSquare].at(index)[1]
                            }
                        }
                    } else {
                        const adjacentPiece = `s${parseInt(piece.currentSquare.slice(1)) + 9}`
                        const edgePieces = ['s8', 's16', 's24', 's27', 's26', 's25']
                        if(totalPieces.every(piece => piece.currentSquare !== adjacentPiece)) {
                            if(!edgePieces.includes(piece.currentSquare)) {
                                piece.captures[parseInt(piece.currentSquare.slice(1)) + 9]
                                = availableMovesForSquares[piece.currentSquare].at(index)[1]
                            }
                        }
                    }
                }
            }
        }
    }
}

const getNonCaptureMoves = (piece, index) => {
    for(let square of availableMovesForSquares[piece.currentSquare].at(index)) {
        if(square) {
            if(totalPieces.every(piece => piece.currentSquare !== `s${square}`)) {
                piece.availableMoves.push(square)
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
            for(let piece of totalPieces) {
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
                if(isValidMove(selectedPiece, square)) {
                    selectedPiece.currentSquare = square.id
                    selectedPiece = null
                    checkForKing()
                    renderBoard()
                    createPieceEventListeners()
                    switchTurn()
                }
            }
        })
    }
}

const isValidMove = (selectedPiece, square) => {
    if(Object.keys(selectedPiece.captures).length !== 0) {
        if((parseInt(square.id.slice(1))) in selectedPiece.captures) {
            for(let piece of totalPieces) {
                if(piece.currentSquare === `s${selectedPiece.captures[square.id.slice(1)]}`) {
                    piece.isAlive = false
                    piece.currentSquare = null
                }
            }
            return true
        }
    } else {
        if(selectedPiece.availableMoves.includes(parseInt(square.id.slice(1)))) {
            return true
        }
    }
}

const checkForKing = () => {
    const playerOneKingSquares = ['s1', 's2', 's3', 's4']
    const playerTwoKingSquares = ['s29', 's30', 's31', 's32']
    for(let piece of playerOnePieces) {
        if(playerOneKingSquares.includes(piece.currentSquare)) {
            piece.isKing = true
        }
    }
    for(let piece of playerTwoPieces) {
        if(playerTwoKingSquares.includes(piece.currentSquare)) {
            piece.isKing = true
        }
    }
}

const switchTurn = () => {
    if(player === 0){
        player = 1
        playerTwo.style.color = 'green'
        playerOne.style.color = 'black'
        generateAvailableMoves(playerTwoPieces, playerOnePieces)
    } else {
        player = 0
        playerTwo.style.color = 'black'
        playerOne.style.color = 'green'
        generateAvailableMoves(playerOnePieces, playerTwoPieces)
    }
}

restartButton.addEventListener('click', () => {
    playerOnePieces = []
    playerTwoPieces = []
    totalPieces = []
    player = 0
    playerTwo.style.color = 'black'
    playerOne.style.color = 'green'
    initialize()
})


const initialize = () => {
    createUserPieces()
    renderBoard()
    createPieceEventListeners()
    createSquareEventListeners()
    generateAvailableMoves(playerOnePieces, playerTwoPieces)
}

initialize()