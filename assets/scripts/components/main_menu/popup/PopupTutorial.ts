import { _decorator, Button, Component, Node, PageView } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PopupTutorial')
export class PopupTutorial extends Component {

    @property(PageView)
    pageView: PageView = null!;

    @property(Button)
    btnNext: Button = null!;

    @property(Button)
    btnPrev: Button = null!;

    onLoad() {
        this.pageView.node.on('page-turning', this.onPageTurned, this);
        this.btnPrev.node.active = false;
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


