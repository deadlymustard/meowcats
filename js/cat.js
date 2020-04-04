'use strict';

const e = React.createElement;
const CAT_LIMIT = 6;
const MEOW_LIMIT = 4;
const CAT_SCALING_FACTOR = (3/10);
const MAX_CAT_SIZE = 200;

class Cat {
    style;
    imageStyle;

    constructor(x, y, width) {
        const calculatedWidth = ((width * CAT_SCALING_FACTOR) >= MAX_CAT_SIZE) ? MAX_CAT_SIZE : (width * CAT_SCALING_FACTOR);
        this.style = this.generateCatSyle(x, y, calculatedWidth);
        this.imageStyle = this.generateImageStyle(calculatedWidth);
    }

    getRandomTiltValue() {
        const tiltAmount = Math.floor(Math.random() * 25);
        return tiltAmount * (Math.floor(Math.random() * 2) == 1 ? 1 : -1);
    }
    
    getRandomHueValue() {
        return Math.floor(Math.random() * 180);
    }
    
    generateCatSyle(x, y, width) {
        return {
            position: 'absolute',
            top: `${y - Math.floor(width/2)}px`,
            left: `${x- Math.floor(width/2)}px`,
            transform: `rotate(${this.getRandomTiltValue()}deg)`,
            filter: `hue-rotate(${this.getRandomHueValue()}deg) saturate(2)`
        }
    }
    
    generateImageStyle(width) {
        return {
            width: `${width}px`
        }
    }
}

class CatWall extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0,
            windowWidth: 0,
            windowHeight: 0,
            catIndex: 0,
            meowIndex: 0,
            cats: []
        };
    }

    _onMouseMove(e) {
        this.setState({ x: e.clientX, y: e.clientY });
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
      }
      
      componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
      }
      
      updateWindowDimensions() {
        this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
      }

    createCat = () => {
        this.addCat(this.state.x, this.state.y);
        new Audio(`../assets/audio/meow0${this.state.meowIndex}.mp3`).play();
    }
    
    addCat(x, y) {
        this.setState(state => {
            const currentCatIndex = (state.catIndex === CAT_LIMIT) ? 0 : state.catIndex;
            const currentMeowIndex = (state.meowIndex === MEOW_LIMIT) ? 0: state.meowIndex;
            let cats = state.cats.slice()
            cats.splice(currentCatIndex, 1, new Cat(x, y, state.windowWidth));

            return {
                catIndex: currentCatIndex + 1,
                x: state.x,
                y: state.y,
                meowIndex: currentMeowIndex + 1,
                cats
            }
        })
    }

    render() {
        return (
            <div
                id="catWall"
                onClick={() => this.createCat()}
                onMouseMove={this._onMouseMove.bind(this)}>
                {this.state.cats.map((cat, index) => {
                    return (
                        <div style={cat.style}>
                            <img src={`../assets/image/processed/cat0${index + 1}.png`} style={cat.imageStyle} />
                        </div>
                    )
                })}
            </div>
        );
    }
}

const domContainer = document.querySelector('#root');

ReactDOM.render(e(CatWall), domContainer);