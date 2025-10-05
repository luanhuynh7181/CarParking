import { _decorator, Button, Component, Node, PageView, Size, UITransform, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PopupTutorial')
export class PopupTutorial extends Component {

    @property(PageView)
    pageView: PageView = null!;

    @property(Button)
    btnNext: Button = null!;

    @property(Button)
    btnPrev: Button = null!;

    @property(UITransform)
    bgTutorial: UITransform = null!;

    onLoad() {
        this.pageView.node.on('page-turning', this.onPageTurned, this);
        this.btnPrev.node.active = false;
        this.onScreenResize(view.getVisibleSize(), view.getVisibleSize());
    }

    onScreenResize(designResolution: Size, screenResolution: Size) {
        this.bgTutorial.setContentSize(screenResolution.width, this.bgTutorial.height);
        this.btnPrev.node.setPosition(new Vec3(-screenResolution.width / 2 + 65, this.btnPrev.node.position.y));
        this.btnNext.node.setPosition(new Vec3(screenResolution.width / 2 - 65, this.btnNext.node.position.y));
    }


    onPageTurned(pageView: PageView) {
        const index = this.pageView.getCurrentPageIndex();
        const total = this.pageView.getPages().length;
        this.btnPrev.node.active = index > 0;
        this.btnNext.node.active = index < total - 1;
    }

    onClickNext() {
        this.pageView.scrollToPage(this.pageView.getCurrentPageIndex() + 1);
    }
    onClickPrev() {
        this.pageView.scrollToPage(this.pageView.getCurrentPageIndex() - 1);
    }

}


