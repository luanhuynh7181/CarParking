import { _decorator, Component, Label, Sprite, SpriteFrame, Color, assetManager, Texture2D, ImageAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemLeaderboard')
export class ItemLeaderboard extends Component {
    @property(Label)
    lbrank: Label = null!;

    @property(Label)
    lbName: Label = null!;

    @property(Label)
    lbStar: Label = null!;

    @property(Sprite)
    avatarUrl: Sprite = null!;

    setData(rank: number, name: string, star: number, avatarUrl: string) {
        // Đổi màu nền xen kẽ theo rank
        const bgSprite = this.node.getComponent(Sprite);
        bgSprite.color = Color.fromHEX(new Color(), rank % 2 === 0 ? '#103120' : '#32AE69');

        // Set text
        this.lbrank.string = `#${rank + 1}`;
        this.lbName.string = name;
        if (name.length > 14) name = name.substring(0, 11) + '...';
        this.lbStar.string = star.toString();

        // Load ảnh
        this.loadAvatar(avatarUrl);
    }

    private loadAvatar(avatarUrl: string) {
        fetch(avatarUrl)
            .then(res => res.blob())
            .then(blob => {
                const img = document.createElement('img');
                img.onload = () => {
                    const imageAsset = new ImageAsset(img);
                    const texture = new Texture2D();
                    texture.image = imageAsset;
                    const spriteFrame = new SpriteFrame();
                    spriteFrame.texture = texture;
                    this.avatarUrl.spriteFrame = spriteFrame;
                    URL.revokeObjectURL(img.src);
                };
                img.src = URL.createObjectURL(blob);
            })
            .catch(err => console.error('❌ Avatar load failed:', err));

    }
}
