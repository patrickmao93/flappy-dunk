import GameModel from "../Game/GameModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BallController extends cc.Component {
    @property
    hopSpeed: number = 600;

    @property
    gravity: number = -1000;

    @property
    defaultAccel: number = 1000;

    @property
    speed: number = 300;

    @property(cc.SpriteFrame)
    defaultSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    smilyFaceSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    cryFaceSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    dizzyFaceSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    roflFaceSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    squintingFaceSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    starFaceSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    partyFaceSprite: cc.SpriteFrame = null;

    private game: GameModel;
    private rigidbody: cc.RigidBody;
    private accel: number;
    private sprite: cc.Sprite;

    onLoad() {
        cc.director.getCollisionManager().enabled = true;

        const physicsManager = cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.gravity = cc.v2(0, this.gravity);

        this.rigidbody = this.getComponent(cc.RigidBody);
        this.rigidbody.enabledContactListener = true;

        this.sprite = this.getComponent(cc.Sprite);
        this.sprite.spriteFrame = this.defaultSprite;

        this.accel = this.defaultAccel;

        this.initEvents();
    }

    init(game: GameModel) {
        this.game = game;
        this.node.opacity = 0;
        this.node.setPosition(game.playerSpawnPosition);
        this.rigidbody.linearVelocity = cc.v2(this.speed, 0);
    }

    update(dt: number) {
        if ((this.game && this.game.isPaused()) || !this.game) {
            this.rigidbody.type = cc.RigidBodyType.Static;
            return;
        }
        this.rigidbody.type = cc.RigidBodyType.Dynamic;

        if (this.rigidbody.linearVelocity.x > this.speed) {
            this.rigidbody.linearVelocity = cc.v2(this.speed, this.rigidbody.linearVelocity.y);
            return;
        } else if (this.rigidbody.linearVelocity.x < 0) {
            this.rigidbody.linearVelocity = cc.v2(
                this.rigidbody.linearVelocity.x / 10,
                this.rigidbody.linearVelocity.y
            );
        }
        this.rigidbody.linearVelocity = cc.v2(
            this.rigidbody.linearVelocity.x + this.accel * dt,
            this.rigidbody.linearVelocity.y
        );
    }

    initEvents() {
        // game start
        cc.director.on("game_start", () => {
            this.displayEmoji("partyFaceSprite");
            this.node.opacity = 255;
        });
        // ball hit hoop and scored
        cc.director.on(
            "contact",
            () => {
                if (this.game.getCombo() > 2) {
                    this.displayEmoji("cryFaceSprite", 800);
                }
            },
            this
        );
        // normal hit
        cc.director.on(
            "hit",
            () => {
                if (this.game.getCombo() <= 2) {
                    this.displayEmoji("smilyFaceSprite");
                }
            },
            this
        );
        // ball swished hoop
        cc.director.on(
            "swish",
            () => {
                if (this.game.getCombo() < 2) {
                    this.displayEmoji("squintingFaceSprite", 800);
                } else {
                    this.displayEmoji("roflFaceSprite", 800);
                }
            },
            this
        );
        // ball missed hoop
        cc.director.on(
            "game_over",
            () => {
                this.displayEmoji("dizzyFaceSprite");
                this.accel = 0;
            },
            this
        );
    }

    hop() {
        this.rigidbody.linearVelocity = cc.v2(this.rigidbody.linearVelocity.x, this.hopSpeed);
    }

    onBeginContact() {
        this.accel = 0;
        cc.director.emit("bounce");
    }

    onEndContact() {
        this.accel = this.defaultAccel;
    }

    private displayEmoji(spriteName: string, timeout?: number) {
        if (!this.hasOwnProperty(spriteName)) {
            return;
        }

        this.sprite.spriteFrame = this[spriteName];

        if (timeout) {
            const self = this;
            setTimeout(() => {
                if (this.game.getIsGameOver()) return;
                self.sprite.spriteFrame = self.defaultSprite;
            }, timeout);
        }
    }
}
