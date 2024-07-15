import { _decorator, Component, Input, Node, input, EventKeyboard, KeyCode, instantiate, Prefab, Collider2D, Contact2DType, IPhysics2DContact, Label, director, Director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameRoot')
export class GameRoot extends Component {
    @property(Node) player: Node;
    @property(Node) hensRoot: Node;
    @property(Node) eggsRoot: Node;
    @property(Prefab) eggPrefab: Prefab;
    @property(Label) scoreLabel: Label;

    playerPosIndex = 2
    hensPosArr = []
    hp = 3
    score = 0
    initData() {
        for (let i = 0; i < this.hensRoot.children.length; i++) {
            this.hensPosArr.push(this.hensRoot.children[i].position.x)
        }
        console.log(this.hensPosArr);
        this.renderPlayerPos()
    }
    start() {
        this.initData()
        this.openInputEvent()
        this.openCollider2DEvent()
        this.startCreateEggs()
        this.renderPlayerScore()
    }

    openInputEvent() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    openCollider2DEvent() {
        const comp = this.player.getComponent(Collider2D)
        comp.on(Contact2DType.BEGIN_CONTACT, (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) => {
            console.log("碰到了!!!!");
            this.score++
            this.renderPlayerScore()
            director.once(Director.EVENT_AFTER_PHYSICS, () => {
                otherCollider.node.destroy()
            }, this)
        }, this)
    }
    onKeyDown(event: EventKeyboard) {
        console.log(event);
        switch (event.keyCode) {
            case KeyCode.ARROW_LEFT: // left
                this.movePlayer(-1)
                break
            case KeyCode.ARROW_RIGHT: // right
                this.movePlayer(1)
                break
        }
    }

    startCreateEggs() {
        this.schedule(this.createOneEgg, 2)
        // this.createOneEgg1()
    }

    createOneEgg() {
        const randomIndex = Math.floor(Math.random() * this.hensPosArr.length)
        const egg = instantiate(this.eggPrefab)
        this.eggsRoot.addChild(egg)
        console.log(`O: x:${this.hensPosArr[randomIndex]}, y:${this.hensRoot.position.y} eggY:${this.eggsRoot.position.y}` );
        egg.setPosition(this.hensPosArr[randomIndex], this.hensRoot.position.y - this.eggsRoot.position.y)
        
    }

    createOneEgg1() {
        for (let i = 0; i < this.hensPosArr.length; i++) {
            const egg = instantiate(this.eggPrefab)
            this.eggsRoot.addChild(egg)
            egg.setPosition(this.hensPosArr[i], this.hensRoot.position.y)
        }  
    }

    renderPlayerScore() {
        this.scoreLabel.string = `score: ${this.score} 分`
    }
    movePlayer(dir: 1 | -1) {
        this.playerPosIndex += dir
        if (this.playerPosIndex < 0) {
            this.playerPosIndex = this.hensPosArr.length - 1
        }
        if (this.playerPosIndex >= this.hensPosArr.length) {
            this.playerPosIndex = 0
        }
        this.renderPlayerPos()
    }

    renderPlayerPos() {
        const x = this.hensPosArr[this.playerPosIndex]
        const y = this.player.position.y
        console.log(`renderPlayerPos: x:${x}, y:${y}`);
        this.player.setPosition(x, y)
    }
    update(deltaTime: number) {
        for(let i = 0; i < this.eggsRoot.children.length; i++) {
            const egg = this.eggsRoot.children[i]
            const x = this.eggsRoot.children[i].position.x;
            const y = this.eggsRoot.children[i].position.y - 150 * deltaTime

            this.eggsRoot.children[i].setPosition(x, y)

            if (y < -600) {
                egg.destroy()
            }
        }
    }
}


