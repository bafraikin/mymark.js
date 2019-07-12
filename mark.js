class Mark {

  constructor() {
    Mark.div = Mark.div || document.querySelector('#isSelectionable');
    this.failed = true;
    if (!Mark.div)
      return ;
    this.failed = false;
    Mark.nb = Mark.nb + 1 || 0;
    this.get_selection = this.correct_selection(this.saveSelection());
  }

  static get number() {
    return Mark.nb || 0;
  }

  correct_selection(get_selection) {
    let range = document.createRange();
    let div = Mark.div;
    range.selectNodeContents(div);

    if (get_selection.intersectsNode(div))
    {
      if (!is_include_in(div, get_selection.startContainer))
        get_selection.setStart(div, 0);
      if (!is_include_in(div, get_selection.endContainer))
        get_selection.setEnd(div, range.endOffset);
      return get_selection;
    }
    this.failed = true;
    return null;
  }

  saveSelection() {
    if (window.getSelection) {
      var sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    } else if (document.selection && document.selection.createRange) {
      return document.selection.createRange();
    }
    return null;
  }

}
