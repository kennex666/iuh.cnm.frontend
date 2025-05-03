class TabBarManager {
    private _isVisible = true;

    get isVisible(): boolean {
        return this._isVisible;
    }

    show(): void {
        this._isVisible = true;
    }

    hide(): void {
        this._isVisible = false;
    }
}

export default new TabBarManager();
